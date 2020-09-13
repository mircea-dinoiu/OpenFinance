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

router.get(
    '/balance-by-location',
    [validateAuth, validateProject],
    async (req, res) => {
        const pullStart = Date.now();
        const groupedWhere = makeWhere(req.query);

        const grouped = await sql.query(
            `SELECT 
                money_location_id as \`id\`, 
                SUM(sum) as \`cashValue\`, 
                SUM(expenses.stock_units * stocks.price) as \`marketValue\` 
                FROM expenses
                LEFT JOIN stocks on expenses.stock_id = stocks.id 
                ${groupedWhere.query} GROUP by money_location_id`,
            {
                replacements: groupedWhere.replacements,
                type: QueryTypes.SELECT,
            },
        );

        logger.log(req.path, 'Pulling took', Date.now() - pullStart, 'millis');
        res.json(grouped);
    },
);

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
              query: `WHERE ${where
                  .map((each) => each.query || each)
                  .join(' AND ')}`,
              replacements: flatten(
                  where.map((each) => each.replacements || null),
              ).filter(Boolean),
          }
        : {
              query: '',
              replacements: [],
          };
};

module.exports = router;
