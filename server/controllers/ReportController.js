const ExpenseService = require('../services/ExpenseService');
const IncomeService = require('../services/IncomeService');
const SummaryReportService = require('../services/SummaryReportService');
const CurrencyController = require('./CurrencyController');
const {User, Category, MoneyLocation} = require('../models');
const ChartReportHelper = require('../helpers/ChartReportHelper');
const {Validator} = require('../validators');

module.exports = {
    async getSummary(req, res) {
        let [
            expenseRecords,
            incomeRecords,
            userRecords,
            mlRecords,
            categoryRecords,
            defaultCurrency
        ] = await Promise.all([
            ExpenseService.list(req.query),
            IncomeService.list(req.query),
            User.findAll(),
            MoneyLocation.findAll(),
            Category.findAll(),
            CurrencyController.getDefaultCurrency()
        ]);

        if (expenseRecords.error) {
            res.status(400);
            res.json(expenseRecords.json);
            return;
        } else {
            expenseRecords = expenseRecords.json;
        }

        if (incomeRecords.error) {
            res.status(400);
            res.json(incomeRecords.json);
            return;
        } else {
            incomeRecords = incomeRecords.json;
        }

        const ret = {
            expensesData: await SummaryReportService.getExpensesData({
                expenseRecords,
                userRecords,
                mlRecords,
                defaultCurrency,
                incomeRecords,
            }),
            incomesData: SummaryReportService.getIncomesData({
                userRecords,
                mlRecords,
                incomeRecords,
            }),
            expensesByCategory: await SummaryReportService.getExpensesByCategory({
                expenseRecords,
                defaultCurrency,
                categoryRecords,
                userRecords,
            })
        };

        ret.remainingData = SummaryReportService.getRemainingData({
            expenses: ret.expensesData,
            incomes: ret.incomesData,
            userRecords,
            mlRecords,
        });

        res.json(ret);
    },

    async getExpensesByCategoryChart(req, res) {
        const input = {
            display: req.query.display
        };
        const rules = {
            display: ['isRequired', ['isIn', ['am', 'cm', 'ay']]]
        };
        const validator = new Validator(input, rules);

        if (false === await validator.passes()) {
            res.status(400);
            res.json(validator.errors());

            return;
        }

        const series = [];
        const categoryIds = [];
        const timeMap = {};
        const timeFormat = ChartReportHelper.getTimeFormat(input.display);
        let [
            expenseRecords,
            categoryRecords,
            defaultCurrency
        ] = await Promise.all([
            ExpenseService.list(req.query),
            Category.findAll(),
            CurrencyController.getDefaultCurrency()
        ]);

        if (expenseRecords.error) {
            res.status(400);
            res.json(expenseRecords.json);
            return;
        } else {
            expenseRecords = expenseRecords.json;
        }

        for (const record of expenseRecords) {
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

                const dataKey = 'data' + categoryId;

                ChartReportHelper.addToTimeMap(timeMap, dataKey, json, rawCatSum / (recordCategories.length || 1), timeFormat);
            };

            if (json.currency_id !== parseInt(defaultCurrency.id)) {
                sum = await CurrencyController.convertToDefault(sum, json.currency_id);
            }

            if (recordCategories.length > 0) {
                recordCategories.forEach(function (rawCategoryId) {
                    let categoryId;

                    if (categoryRecords.find(each => each.id == rawCategoryId)) {
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

        categoryIds.forEach(function (id) {
            const title = id == 0 ? '<i>Unclassified</i>' : categoryRecords.find(each => each.id == id).name;

            series.push({
                title,
                yField: 'data' + id
            });
        });

        const categoryIdsAsFields = categoryIds.map(function (id) {
            return 'data' + id;
        });

        res.json({
            fields: categoryIdsAsFields,
            map: timeMap,
            series: series
        });
    }
};