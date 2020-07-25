const ExpenseService = require('../services/ExpenseService');
const SummaryReportService = require('../services/SummaryReportService');
const {
    User,
    Category,
    MoneyLocation,
    Currency,
    Expense,
    sql,
} = require('../models');
const logger = require('../helpers/logger');
const RepeatedModelsHelper = require('../helpers/RepeatedModelsHelper');
const {mapStartDateToSQL, mapEndDateToSQL} = require('../helpers/sql');
const {flatten} = require('lodash');
const {QueryTypes} = require('sequelize');

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

const getClones = async (
    {start_date: startDate, ...queryParams},
    {cols, where: whereExtra},
) => {
    const {query: where, replacements} = makeWhere(queryParams, [
        '`repeat` IS NOT null',
        ...whereExtra,
    ]);
    const select = `SELECT ${[
        ...cols,
        '`created_at`',
        '`repeat`',
        '`repeat_occurrences`',
    ].join(', ')} FROM expenses ${where}`;

    const records = await sql.query(select, {
        replacements,
        type: QueryTypes.SELECT,
    });

    return RepeatedModelsHelper.getClonesForRecords({
        records: records,
        endDate: queryParams.end_date,
        startDate: startDate,
    });
};

const sumByLocationFactory = ({where = []} = {}) => (req, res) => {
    const pullStart = Date.now();
    const queryParams = req.query;
    const groupedWhere = makeWhere(req.query, where);

    Promise.all([
        getClones(queryParams, {
            cols: ['money_location_id', 'sum'],
            where,
        }),
        sql.query(
            `SELECT money_location_id as \`key\`, SUM(sum) as \`value\` FROM expenses ${groupedWhere.query} GROUP by money_location_id`,
            {replacements: groupedWhere.replacements, type: QueryTypes.SELECT},
        ),
    ]).then(([clones, grouped]) => {
        const result = grouped.reduce(
            (acc, {key, value}) => ({...acc, [key]: value}),
            {},
        );

        clones.forEach((record) => {
            result[record.money_location_id] =
                (result[record.money_location_id] || 0) + record.sum;
        });

        logger.log(req.path, 'Pulling took', Date.now() - pullStart, 'millis');
        res.json(result);
    });
};

module.exports = class ReportController {
    async getSummary(req, res) {
        const pullStart = Date.now();

        const [
            expenseRecords,
            userRecords,
            mlRecords,
            categoryRecords,
            currencyRecords,
        ] = await Promise.all([
            ExpenseService.list(req.query),
            User.findAll(),
            MoneyLocation.findAll(),
            Category.findAll(),
            Currency.findAll(),
        ]);

        logger.log(
            'ReportController.getSummary',
            'Pulling took',
            Date.now() - pullStart,
            'millis',
        );

        if (expenseRecords.error) {
            res.status(400);
            res.json(expenseRecords.json);

            return;
        }

        const processingStart = Date.now();

        const mlIdToCurrencyId = mlRecords.reduce((acc, each) => {
            acc[each.id] = each.currency_id;

            return acc;
        }, {});
        const userIdToFullName = userRecords.reduce((acc, each) => {
            acc[each.id] = each.full_name;

            return acc;
        }, {});
        const currencyIdToISOCode = currencyRecords.reduce((acc, each) => {
            acc[each.id] = each.iso_code;

            return acc;
        }, {});
        const common = {
            mlIdToCurrencyId,
            userIdToFullName,
            currencyIdToISOCode,
            html: req.query.html,
        };
        const expenseRecordsAsJSON = expenseRecords.json;

        const transactions = SummaryReportService.getTransactions({
            expenseRecords: expenseRecordsAsJSON,
            userRecords,
            mlRecords,
            ...common,
        });
        const expenses = SummaryReportService.getTransactions({
            expenseRecords: expenseRecordsAsJSON.filter(
                (transaction) => transaction.sum < 0,
            ),
            userRecords,
            mlRecords,
            ...common,
        });

        const expensesByCategory = SummaryReportService.getExpensesByCategory({
            expenseRecords: expenseRecordsAsJSON,
            categoryRecords,
            ...common,
        });

        const remainingData = SummaryReportService.getBalances({
            expenses: transactions,
            ...common,
        });

        logger.log(
            'ReportController.getSummary',
            'Processing took',
            Date.now() - processingStart,
            'millis',
            `(expenses: ${expenseRecords.json.length})`,
        );

        res.json({
            expensesData: expenses,
            expensesByCategory,
            remainingData,
        });
    }
    async getBalanceByLocation(req, res) {
        sumByLocationFactory()(req, res);
    }
    async getExpensesByLocation(req, res) {
        sumByLocationFactory({
            where: ['`sum` < 0'],
        })(req, res);
    }
};
