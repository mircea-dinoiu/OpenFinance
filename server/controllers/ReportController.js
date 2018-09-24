const ExpenseService = require('../services/ExpenseService');
const IncomeService = require('../services/IncomeService');
const SummaryReportService = require('../services/SummaryReportService');
const CurrencyController = require('./CurrencyController');
const { User, Category, MoneyLocation, Currency } = require('../models');
const ChartReportHelper = require('../helpers/ChartReportHelper');
const { Validator } = require('../validators');
const logger = require('../helpers/logger');

module.exports = {
    async getSummary(req, res) {
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

        const ret = {
            expensesData: await SummaryReportService.getExpensesData({
                expenseRecords: expenseRecords.json,
                userRecords,
                mlRecords,
                ...common,
            }),
            incomesData: await SummaryReportService.getIncomesData({
                mlRecords,
                incomeRecords: incomeRecords.json,
                ...common,
            }),
            expensesByCategory: await SummaryReportService.getExpensesByCategory(
                {
                    expenseRecords: expenseRecords.json,
                    categoryRecords,
                    ...common,
                },
            ),
        };

        ret.remainingData = SummaryReportService.getRemainingData({
            expenses: ret.expensesData,
            incomes: ret.incomesData,
            mlRecords,
            ...common,
        });

        logger.log(
            'ReportController.getSummary',
            'Processing took',
            Date.now() - processingStart,
            'millis',
        );

        res.json(ret);
    },

    async getExpensesIncomesByUser(req, res) {
        const input = {
            display: req.query.display,
        };
        const rules = {
            display: ['isRequired', ['isIn', ['am', 'cm', 'ay']]],
        };
        const validator = new Validator(input, rules);

        if (false === (await validator.passes())) {
            res.status(400);
            res.json(validator.errors());

            return;
        }

        const [
            expenseRecords,
            incomeRecords,
            userRecords,
            defaultCurrency,
        ] = await Promise.all([
            ExpenseService.list(req.query),
            IncomeService.list(req.query),
            User.findAll(),
            CurrencyController.getDefaultCurrency(),
        ]);

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

        const series = [];
        const fields = [];
        const timeMap = {};
        const timeFormat = ChartReportHelper.getTimeFormat(input.display);
        const addToTimeMap = function (dataKey, record, sum) {
            if (fields.indexOf(dataKey) === -1) {
                fields.push(dataKey);
            }

            ChartReportHelper.addToTimeMap(
                timeMap,
                dataKey,
                record,
                sum,
                timeFormat,
            );
        };

        incomeRecords.json.forEach((record) => {
            if (!ChartReportHelper.recordIsInRange(record, input.display)) {
                return;
            }

            const dataKey = `data${record.user_id}i`;

            addToTimeMap(dataKey, record, record.sum);
        });

        for (const record of expenseRecords.json) {
            if (!ChartReportHelper.recordIsInRange(record, input.display)) {
                continue;
            }

            const json = record.toJSON();
            const users = json.users;
            const currencyId = json.currency_id;
            let sum = json.sum;

            if (currencyId !== parseInt(defaultCurrency.id)) {
                sum = await CurrencyController.convertToDefault(
                    sum,
                    currencyId,
                );
            }

            sum /= users.length;

            users.forEach((id) => {
                const dataKey = `data${id}e`;

                addToTimeMap(dataKey, json, sum);
            });
        }

        fields.forEach((field) => {
            const cleanField = field.replace(/data/, '');
            const id = cleanField.replace(/[ei]/g, '');
            const type = field.endsWith('e') ? 'Expenses' : 'Incomes';

            series.push({
                title: `${
                    userRecords.find((each) => each.id == id).first_name
                }'s ${type}`,
                yField: field,
            });
        });

        res.json({
            fields,
            map: timeMap,
            series,
        });
    },

    async getExpensesByCategoryChart(req, res) {
        const input = {
            display: req.query.display,
        };
        const rules = {
            display: ['isRequired', ['isIn', ['am', 'cm', 'ay']]],
        };
        const validator = new Validator(input, rules);

        if (false === (await validator.passes())) {
            res.status(400);
            res.json(validator.errors());

            return;
        }

        const series = [];
        const categoryIds = [];
        const timeMap = {};
        const timeFormat = ChartReportHelper.getTimeFormat(input.display);
        const [
            expenseRecords,
            categoryRecords,
            defaultCurrency,
        ] = await Promise.all([
            ExpenseService.list(req.query),
            Category.findAll(),
            CurrencyController.getDefaultCurrency(),
        ]);

        if (expenseRecords.error) {
            res.status(400);
            res.json(expenseRecords.json);

            return;
        }

        for (const record of expenseRecords.json) {
            if (!ChartReportHelper.recordIsInRange(record, input.display)) {
                continue;
            }

            const json = record.toJSON();
            const recordCategories = json.categories;
            let sum = json.sum;
            const addData = function (categoryId, rawCatSum) {
                if (categoryIds.indexOf(categoryId) === -1) {
                    categoryIds.push(categoryId);
                }

                const dataKey = `data${categoryId}`;

                ChartReportHelper.addToTimeMap(
                    timeMap,
                    dataKey,
                    json,
                    rawCatSum / (recordCategories.length || 1),
                    timeFormat,
                );
            };

            if (json.currency_id !== parseInt(defaultCurrency.id)) {
                sum = await CurrencyController.convertToDefault(
                    sum,
                    json.currency_id,
                );
            }

            if (recordCategories.length > 0) {
                recordCategories.forEach((rawCategoryId) => {
                    let categoryId;

                    if (
                        categoryRecords.find((each) => each.id == rawCategoryId)
                    ) {
                        categoryId = rawCategoryId;
                    } else {
                        categoryId = 0;
                    }

                    addData(categoryId, sum);
                });
            } else {
                addData(0, sum);
            }
        }

        categoryIds.forEach((id) => {
            const title =
                id == 0
                    ? '<i>Unclassified</i>'
                    : categoryRecords.find((each) => each.id == id).name;

            series.push({
                title,
                yField: `data${id}`,
            });
        });

        const categoryIdsAsFields = categoryIds.map((id) => `data${id}`);

        res.json({
            fields: categoryIdsAsFields,
            map: timeMap,
            series,
        });
    },
};
