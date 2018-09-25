const ExpenseService = require('../services/ExpenseService');
const IncomeService = require('../services/IncomeService');
const SummaryReportService = require('../services/SummaryReportService');
const { User, Category, MoneyLocation, Currency } = require('../models');
const logger = require('../helpers/logger');

module.exports = {
    async getSummary(req, res) {
        const pullStart = Date.now();

        const [
            expenseRecords,
            incomeRecords,
            userRecords,
            mlRecords,
            categoryRecords,
            currencyRecords,
        ] = await Promise.all([
            ExpenseService.list(req.query),
            IncomeService.list(req.query),
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
        if (incomeRecords.error) {
            res.status(400);
            res.json(incomeRecords.json);

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

        const expensesData = SummaryReportService.getExpensesData({
            expenseRecords: expenseRecords.json,
            userRecords,
            mlRecords,
            ...common,
        });

        const incomesData = SummaryReportService.getIncomesData({
            mlRecords,
            incomeRecords: incomeRecords.json,
            ...common,
        });

        const expensesByCategory = SummaryReportService.getExpensesByCategory(
            {
                expenseRecords: expenseRecords.json,
                categoryRecords,
                ...common,
            },
        );

        const remainingData = SummaryReportService.getRemainingData({
            expenses: expensesData,
            incomes: incomesData,
            mlRecords,
            ...common,
        });

        logger.log(
            'ReportController.getSummary',
            'Processing took',
            Date.now() - processingStart,
            'millis',
            `(expenses: ${expenseRecords.json.length})`
        );

        res.json({
            expensesData,
            incomesData,
            expensesByCategory,
            remainingData,
        });
    },
};
