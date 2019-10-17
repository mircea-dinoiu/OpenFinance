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

const makeWhere = (queryParams, extra = []) => {
    const where = [
        ...extra,
        mapStartDateToSQL(queryParams.start_date, Expense, true),
        mapEndDateToSQL(queryParams.end_date, Expense, true),
    ].filter(Boolean);

    if (queryParams.include_pending === 'false') {
        where.push(`\`status\` != 'pending'`);
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

const getRepeated = async ({start_date: startDate, ...queryParams}, cols) => {
    const {query: where, replacements} = makeWhere(queryParams, [
        '`repeat` IS NOT null',
    ]);
    const select = `SELECT ${[
        ...cols,
        '`created_at`',
        '`repeat`',
        '`repeat_occurrences`',
    ].join(', ')} FROM expenses ${where}`;

    return RepeatedModelsHelper.generateClones({
        records: (await sql.query(select, {replacements}))[0],
        endDate: queryParams.end_date,
        startDate: startDate,
    });
};

const sumByLocationFactory = () => (req, res) => {
    const pullStart = Date.now();
    const queryParams = req.query;
    const groupedWhere = makeWhere(req.query);

    Promise.all([
        getRepeated(queryParams, ['money_location_id', 'sum']),
        sql.query(
            `SELECT money_location_id as \`key\`, SUM(sum) as \`value\` FROM expenses ${groupedWhere.query} GROUP by money_location_id`,
            {replacements: groupedWhere.replacements},
        ),
    ]).then(([repeated, grouped]) => {
        const result = grouped[0].reduce(
            (acc, {key, value}) => ({...acc, [key]: value}),
            {},
        );

        repeated.forEach((record) => {
            result[record.money_location_id] =
                (grouped[record.money_location_id] || 0) + record.sum;
        });

        logger.log(
            req.path,
            'Pulling took',
            Date.now() - pullStart,
            'millis',
        );
        res.json(result);
    });
};

module.exports = {
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
                (transaction) => transaction.type !== 'deposit',
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
            mlRecords,
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
    },
    async getBalanceByLocation(req, res) {
        sumByLocationFactory()(req, res);
    },
};
