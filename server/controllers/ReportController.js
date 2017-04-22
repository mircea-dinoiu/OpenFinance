const ExpenseService = require('../services/ExpenseService');
const IncomeService = require('../services/IncomeService');
const CurrencyController = require('./CurrencyController');
const {User, Category, MoneyLocation} = require('../models');
const {sortBy, uniq, concat} = require('lodash');

const description = (text) => {
    return `<span data-qtip="${text}">${text}</span>`;
};

const safeNum = function (num) {
    return Number(num.toFixed(2));
};

module.exports = {
    async getList(req, res) {
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
            expensesData: await this.getExpensesData({
                expenseRecords,
                userRecords,
                mlRecords,
                defaultCurrency,
                incomeRecords,
            }),
            incomesData: this.getIncomesData({
                userRecords,
                mlRecords,
                incomeRecords,
            }),
            expensesByCategory: await this.getExpensesByCategory({
                expenseRecords,
                defaultCurrency,
                categoryRecords,
                userRecords,
            })
        };

        ret.remainingData = this.getRemainingData({
            expenses: ret.expensesData,
            incomes: ret.incomesData,
            userRecords,
            mlRecords,
        });

        res.json(ret);
    },

    getUniques: function (expenses, incomes) {
        return uniq(concat(
            expenses,
            incomes
        ).filter(function (item) {
            return item.isTotal !== true;
        }).map(function (item) {
            return parseInt(item.reference);
        }));
    },

    getRemainingSum: function (expenses, incomes, id) {
        let filteredExpenses, filteredIncomes;

        filteredExpenses = expenses.filter(function (expense) {
            return expense.reference === id;
        })[0];

        filteredIncomes = incomes.filter(function (income) {
            return income.reference === id;
        })[0];

        filteredExpenses = filteredExpenses ? filteredExpenses.sum : 0;
        filteredIncomes = filteredIncomes ? filteredIncomes.sum : 0;

        return safeNum(filteredIncomes - filteredExpenses);
    },

    getRemainingData({expenses, incomes, userRecords, mlRecords}) {
        let data = {byUser: [], byML: []},
            users,
            mls,
            totalRemainingByUser = {},
            totalRemainingByML = {};

        users = this.getUniques(expenses.byUser, incomes.byUser);
        mls = this.getUniques(expenses.byML, incomes.byML);

        /**
         * Remaining present
         */
        mls.forEach((id) => {
            totalRemainingByML[id] = this.getRemainingSum(expenses.byML, incomes.byML, id);
        });

        users.forEach((id) => {
            totalRemainingByUser[id] = this.getRemainingSum(expenses.byUser, incomes.byUser, id);
        });

        /**
         * Total remaining
         */
        Object.keys(totalRemainingByUser).forEach(function (id) {
            const sum = totalRemainingByUser[id];

            data.byUser.push({
                sum: sum,
                description: description(userRecords.find(each => each.id == id).full_name)
            });
        });

        Object.keys(totalRemainingByML).forEach(id => {
            const sum = totalRemainingByML[id];

            if (sum !== 0) {
                const ml = mlRecords.find(each => each.id == id);

                data.byML.push({
                    sum: sum,
                    description: description(this.formatMLName(id, {mlRecords})),
                    group: (ml ? ml.type_id : 0) || 0
                });
            }
        });

        return data;
    },

    getIncomesData({incomeRecords, userRecords, mlRecords}) {
        const data = {byUser: [], byML: []},
            users = {},
            mls = {};

        for (const record of incomeRecords) {
            const uId = record.user_id;
            const mlId = record.money_location_id || 0;
            const sum = record.sum;

            users[uId] = (users[uId] || 0) + sum;
            mls[mlId] = (mls[mlId] || 0) + sum;
        }

        Object.keys(users).forEach(id => {
            const sum = users[id];

            data.byUser.push({
                sum: sum,
                description: description(userRecords.find(each => each.id == id).full_name),
                reference: Number(id)
            });
        });

        this.addMLEntries({
            data: data.byML,
            mls,
            mlRecords
        });

        return data;
    },

    async getExpensesData({expenseRecords, userRecords, mlRecords, defaultCurrency}) {
        const users = {};
        const mls = {};

        for (const record of expenseRecords) {
            const json = record.toJSON();
            let sum = json.sum;
            const recordUsers = json.users;
            const currencyId = json.currency_id;
            const mlId = json.money_location_id || 0;

            if (currencyId !== parseInt(defaultCurrency.id)) {
                sum = await CurrencyController.convertToDefault(sum, currencyId);
            }

            mls[mlId] = (mls[mlId] || 0) + sum;

            sum /= recordUsers.length;

            recordUsers.forEach(userId => {
                users[userId] = (users[userId] || 0) + sum;
            });
        }

        const data = {
            byUser: [],
            byML: []
        };

        userRecords.forEach(record => {
            const id = record.id;

            if (users[id]) {
                data.byUser.push({
                    sum: users[id],
                    description: description(record.full_name),
                    reference: id
                });
            }
        });

        this.addMLEntries({
            data: data.byML,
            mls,
            mlRecords
        });

        return data;
    },

    formatMLName(id, {mlRecords}) {
        if (id == 0) {
            return '<i>Unclassified</i>';
        }

        return mlRecords.find(each => each.id == id).name;
    },

    addMLEntries({data, mls, mlRecords}) {
        const push = function (id, name, group) {
            data.push({
                sum: mls[id],
                description: description(name),
                reference: id,
                group: group
            });
        };

        if (mls['0']) {
            push('0', this.formatMLName(0, {mlRecords}));
        }

        sortBy(mlRecords, 'name').forEach(record => {
            const id = record.id;

            if (mls[id]) {
                push(id, record.name, record.type_id);
            }
        });
    },

    async getExpensesByCategory({
        expenseRecords,
        defaultCurrency,
        categoryRecords,
        userRecords,
    }) {
        const categories = {};
        const data = [];

        for (const record of expenseRecords) {
            const json = record.toJSON();
            const recordCategories = json.categories;
            let sum = json.sum;
            const addData = function (categoryId, rawCatSum) {
                if (!categories[categoryId]) {
                    categories[categoryId] = {
                        users: {}
                    };
                }

                const users = json.users;
                const catSum = rawCatSum / users.length;

                users.forEach(function (id) {
                    if (!categories[categoryId].users[id]) {
                        categories[categoryId].users[id] = 0;
                    }

                    categories[categoryId].users[id] += catSum;
                });
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

        const categoryIds = Object.keys(categories).map(function (id) {
            return parseInt(id);
        });

        categoryIds.sort(function (id1, id2) {
            if (id1 == 0) {
                return -1;
            }

            if (id2 == 0) {
                return 1;
            }

            const sum1 = Object.values(categories[id1].users).reduce((acc, el) => acc + el, 0);
            const sum2 = Object.values(categories[id2].users).reduce((acc, el) => acc + el, 0);

            return sum1 > sum2 ? -1 : 1;
        });

        categoryIds.forEach(function (categoryId, index) {
            Object.entries(categories[categoryId].users).forEach(([id, sum]) => {
                data.push({
                    sum: sum,
                    description: description(userRecords.find(each => each.id == id).full_name),
                    group: categoryId,
                    index: index
                });
            });
        });

        return data;
    }
};