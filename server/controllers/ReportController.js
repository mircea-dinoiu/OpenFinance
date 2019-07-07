const ExpenseService = require('../services/ExpenseService');
const SummaryReportService = require('../services/SummaryReportService');
const {User, Category, MoneyLocation, Currency} = require('../models');
const logger = require('../helpers/logger');

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
};
