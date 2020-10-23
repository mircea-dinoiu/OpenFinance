const express = require('express');
const router = express.Router();
const Controller = require('../controllers/ReportController');
const {validateAuth, validateProject} = require('../middlewares');
const {mapStartDateToSQL, mapEndDateToSQL} = require('../helpers/sql');
const {flatten} = require('lodash');
const {QueryTypes} = require('sequelize');
const {Expense, sql} = require('../models');
const logger = require('../helpers/logger');

const c = new Controller();

router.get('/summary', [validateAuth, validateProject], (req, res) => {
    c.getSummary(req, res);
});

router.get('/balance-by-location', [validateAuth, validateProject], async (req, res) => {
    const pullStart = Date.now();
    const cashWhere = makeWhere(req.query);
    const marketWhere = makeWhere(req.query, ['stock_id IS NOT NULL', 'expenses.stock_units != 0']);

    const [cash, stocks] = await Promise.all([
        sql.query(
            `SELECT 
                money_location_id, 
                SUM(sum) as \`sum\`
                FROM expenses ${cashWhere.query} GROUP by money_location_id HAVING sum != 0`,
            {
                replacements: cashWhere.replacements,
                type: QueryTypes.SELECT,
            },
        ),
        sql.query(
            `SELECT 
                money_location_id, 
                SUM(expenses.sum) as cost_basis,
                SUM(stock_units) as stock_units,
                stock_id
                FROM expenses ${marketWhere.query}
                GROUP by money_location_id, stock_id`,
            {
                replacements: marketWhere.replacements,
                type: QueryTypes.SELECT,
            },
        ),
    ]);

    logger.log(req.path, 'Pulling took', Date.now() - pullStart, 'millis');
    res.json({cash, stocks});
});

const makeWhere = (queryParams, extra = []) => {
    const where = [
        ...extra,
        mapStartDateToSQL(queryParams.start_date, Expense, true),
        mapEndDateToSQL(queryParams.end_date, Expense, true),
    ].filter(Boolean);

    if (queryParams.include_pending === 'false') {
        where.push(`\`status\` = 'finished'`);
    } else {
        where.push(`\`status\` != 'draft'`);
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
