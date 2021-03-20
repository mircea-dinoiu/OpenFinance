const express = require('express');
const router = express.Router();
const Controller = require('../controllers/ReportController');
const {validateAuth, validateProject} = require('../middlewares');
const {mapStartDateToSQL, mapEndDateToSQL} = require('../helpers/sql');
const {flatten, groupBy} = require('lodash');
const {QueryTypes} = require('sequelize');
const {Expense, sql} = require('../models');
const logger = require('../helpers/logger');

const c = new Controller();

router.get('/summary', [validateAuth, validateProject], (req, res) => {
    c.getSummary(req, res);
});

router.get('/cash-flow', [validateAuth, validateProject], async (req, res) => {
    const pullStart = Date.now();
    const where = makeWhere(req.query);

    const data = await sql.query(`
        SELECT currency_id, category_id, SUM(quantity * price) as \`sum\` FROM expenses 
        JOIN category_expense ON category_expense.expense_id = expenses.id 
        JOIN money_locations ON expenses.money_location_id = money_locations.id 
        ${where.query} GROUP BY currency_id, category_id HAVING sum != 0;
    `, {
        replacements: where.replacements,
        type: QueryTypes.SELECT,
    });

    logger.log(req.path, 'Pulling took', Date.now() - pullStart, 'millis');
    res.json({data: groupBy(data, 'currency_id')});
});

router.get('/balance-by-location', [validateAuth, validateProject], async (req, res) => {
    const pullStart = Date.now();
    const cashWhere = makeWhere(req.query);
    const marketWhere = makeWhere(req.query, ['stock_id IS NOT NULL', 'expenses.quantity != 0']);
    const inventoryWhere = makeWhere(req.query, ['inventory_id IS NOT NULL']);

    const [cash, stocks, inventories] = await Promise.all([
        sql.query(
            `SELECT 
                money_location_id, 
                SUM(quantity * price) as \`sum\`
                FROM expenses ${cashWhere.query} GROUP by money_location_id HAVING sum != 0`,
            {
                replacements: cashWhere.replacements,
                type: QueryTypes.SELECT,
            },
        ),
        sql.query(
            `SELECT 
                money_location_id, 
                SUM(quantity * price) as cost_basis,
                SUM(quantity) as quantity,
                stock_id
                FROM expenses ${marketWhere.query}
                GROUP by money_location_id, stock_id`,
            {
                replacements: marketWhere.replacements,
                type: QueryTypes.SELECT,
            },
        ),
        sql.query(
            `SELECT inventory_id, 
                ABS(SUM(quantity * price)) as \`sum\`, 
                (SELECT currency_id FROM money_locations WHERE id = money_location_id) as currency_id,
                (SELECT name FROM inventories WHERE id = inventory_id) as name
                FROM expenses
                ${inventoryWhere.query} 
                GROUP by inventory_id, currency_id`,
            {
                replacements: inventoryWhere.replacements,
                type: QueryTypes.SELECT,
            },
        ),
    ]);

    logger.log(req.path, 'Pulling took', Date.now() - pullStart, 'millis');
    res.json({cash, stocks, inventories});
});

const makeWhere = (queryParams, extra = []) => {
    const where = [
        ...extra,
        mapStartDateToSQL(queryParams.start_date, Expense, true),
        mapEndDateToSQL(queryParams.end_date, Expense, true),
    ].filter(Boolean);

    if (queryParams.include_pending === 'false') {
        where.push(`expenses.\`status\` = 'finished'`);
    } else {
        where.push(`expenses.\`status\` != 'draft'`);
    }

    return where.length
        ? {
              query: `WHERE ${where.map((each) => each.query || each).join(' AND ')}`,
              replacements: flatten(where.map((each) => each.replacements || null)).filter(Boolean),
          }
        : {
              query: '',
              replacements: [],
          };
};

module.exports = router;
