const SummaryReportHelper = require('../helpers/SummaryReportHelper');
const CurrencyController = require('../controllers/CurrencyController');
const {sortBy} = require('lodash');

module.exports = {
    getRemainingData({expenses, incomes, userRecords, mlRecords, html}) {
        let data = {byUser: [], byML: []},
            users,
            mls,
            totalRemainingByUser = {},
            totalRemainingByML = {};

        users = SummaryReportHelper.getUniques(expenses.byUser, incomes.byUser);
        mls = SummaryReportHelper.getUniques(expenses.byML, incomes.byML);

        /**
         * Remaining present
         */
        mls.forEach((id) => {
            totalRemainingByML[id] = SummaryReportHelper.getRemainingSum(
                expenses.byML,
                incomes.byML,
                id
            );
        });

        users.forEach((id) => {
            totalRemainingByUser[id] = SummaryReportHelper.getRemainingSum(
                expenses.byUser,
                incomes.byUser,
                id
            );
        });

        /**
         * Total remaining
         */
        Object.keys(totalRemainingByUser).forEach((id) => {
            const sum = totalRemainingByUser[id];

            if (sum !== 0) {
                const user = userRecords.find((each) => each.id == id);

                data.byUser.push({
                    sum,
                    description: SummaryReportHelper.description(
                        user.full_name,
                        {html}
                    )
                });
            }
        });

        Object.keys(totalRemainingByML).forEach((id) => {
            const sum = totalRemainingByML[id];

            if (sum !== 0) {
                const ml = mlRecords.find((each) => each.id == id);

                data.byML.push({
                    sum,
                    description: SummaryReportHelper.description(
                        SummaryReportHelper.formatMLName(id, {
                            mlRecords,
                            html
                        }),
                        {
                            html
                        }
                    ),
                    group: (ml ? ml.type_id : 0) || 0
                });
            }
        });

        return {
            byML: sortBy(data.byML, 'description'),
            byUser: sortBy(data.byUser, 'description')
        };
    },

    async getIncomesData({
        incomeRecords,
        userRecords,
        mlRecords,
        defaultCurrency,
        html
    }) {
        const data = {byUser: [], byML: []},
            users = {},
            mls = {};

        for (const record of incomeRecords) {
            const uId = record.user_id;
            const mlId = record.money_location_id || 0;
            let sum = record.sum;
            const currencyId = record.currency_id;

            if (currencyId !== parseInt(defaultCurrency.id)) {
                sum = await CurrencyController.convertToDefault(
                    sum,
                    currencyId
                );
            }

            users[uId] = (users[uId] || 0) + sum;
            mls[mlId] = (mls[mlId] || 0) + sum;
        }

        Object.keys(users).forEach((id) => {
            const sum = users[id];

            data.byUser.push({
                sum,
                description: SummaryReportHelper.description(
                    userRecords.find((each) => each.id == id).full_name,
                    {html}
                ),
                reference: Number(id)
            });
        });

        SummaryReportHelper.addMLEntries({
            html,
            data: data.byML,
            mls,
            mlRecords
        });

        return data;
    },

    async getExpensesData({
        expenseRecords,
        userRecords,
        mlRecords,
        defaultCurrency,
        html
    }) {
        const users = {};
        const mls = {};

        for (const rawRecord of expenseRecords) {
            const record = rawRecord.toJSON();
            let sum = record.sum;
            const recordUsers = record.users;
            const currencyId = record.currency_id;
            const mlId = record.money_location_id || 0;

            if (currencyId !== parseInt(defaultCurrency.id)) {
                sum = await CurrencyController.convertToDefault(
                    sum,
                    currencyId
                );
            }

            mls[mlId] = (mls[mlId] || 0) + sum;

            sum /= recordUsers.length;

            recordUsers.forEach((userId) => {
                users[userId] = (users[userId] || 0) + sum;
            });
        }

        const data = {
            byUser: [],
            byML: []
        };

        userRecords.forEach((record) => {
            const id = record.id;

            if (users[id]) {
                data.byUser.push({
                    sum: users[id],
                    description: SummaryReportHelper.description(
                        record.full_name,
                        {
                            html
                        }
                    ),
                    reference: id
                });
            }
        });

        SummaryReportHelper.addMLEntries({
            html,
            data: data.byML,
            mls,
            mlRecords
        });

        return data;
    },

    async getExpensesByCategory({
        expenseRecords,
        defaultCurrency,
        categoryRecords,
        userRecords,
        html
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

                users.forEach((id) => {
                    if (!categories[categoryId].users[id]) {
                        categories[categoryId].users[id] = 0;
                    }

                    categories[categoryId].users[id] += catSum;
                });
            };

            if (json.currency_id !== parseInt(defaultCurrency.id)) {
                sum = await CurrencyController.convertToDefault(
                    sum,
                    json.currency_id
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

        const categoryIds = Object.keys(categories).map((id) => parseInt(id));

        categoryIds.sort((id1, id2) => {
            if (id1 == 0) {
                return -1;
            }

            if (id2 == 0) {
                return 1;
            }

            const sum1 = Object.values(categories[id1].users).reduce(
                (acc, el) => acc + el,
                0
            );
            const sum2 = Object.values(categories[id2].users).reduce(
                (acc, el) => acc + el,
                0
            );

            return sum1 > sum2 ? -1 : 1;
        });

        categoryIds.forEach((categoryId, index) => {
            Object.entries(categories[categoryId].users).forEach(
                ([id, sum]) => {
                    data.push({
                        sum,
                        description: SummaryReportHelper.description(
                            userRecords.find((each) => each.id == id).full_name,
                            {html}
                        ),
                        group: categoryId,
                        index
                    });
                }
            );
        });

        return data;
    }
};
