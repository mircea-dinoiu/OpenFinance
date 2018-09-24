const SummaryReportHelper = require('../helpers/SummaryReportHelper');
const { sortBy } = require('lodash');

module.exports = {
    getRemainingData({
        expenses,
        incomes,
        userIdToFullName,
        mlRecords,
        currencyIdToISOCode,
        html,
    }) {
        const data = { byUser: [], byML: [] };
        const totalRemainingByUser = {};
        const totalRemainingByML = {};
        const users = SummaryReportHelper.getUniques(
            expenses.byUser,
            incomes.byUser,
        );
        const mls = SummaryReportHelper.getUniques(expenses.byML, incomes.byML);

        /**
         * Remaining present
         */
        mls.forEach((id) => {
            totalRemainingByML[id] = SummaryReportHelper.getRemainingSum(
                expenses.byML,
                incomes.byML,
                id,
            );
        });

        users.forEach((id) => {
            totalRemainingByUser[id] = SummaryReportHelper.getRemainingSum(
                expenses.byUser,
                incomes.byUser,
                id,
            );
        });

        /**
         * Total remaining
         */
        Object.keys(totalRemainingByUser).forEach((reference) => {
            const sum = totalRemainingByUser[reference];
            const { id, currencyId } = JSON.parse(reference);

            if (sum !== 0) {
                data.byUser.push({
                    sum,
                    description: SummaryReportHelper.description(
                        `${userIdToFullName[id]} (${
                            currencyIdToISOCode[currencyId]
                        })`,
                        { html },
                    ),
                    currencyId,
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
                            html,
                        }),
                        {
                            html,
                        },
                    ),
                    currencyId: ml.currency_id,
                    group: (ml ? ml.type_id : 0) || 0,
                });
            }
        });

        return {
            byML: sortBy(data.byML, 'description'),
            byUser: sortBy(data.byUser, 'description'),
        };
    },

    async getIncomesData({
        incomeRecords,
        mlIdToCurrencyId,
        mlRecords,
        html,
        userIdToFullName,
    }) {
        const data = { byUser: [], byML: [] };
        const users = {};
        const mls = {};

        for (const record of incomeRecords) {
            const userId = record.user_id;
            const mlId = record.money_location_id;
            const sum = record.sum;
            const currencyId = mlIdToCurrencyId[mlId];

            mls[mlId] = SummaryReportHelper.safeNum((mls[mlId] || 0) + sum);

            users[userId] = users[userId] || {};
            users[userId][currencyId] = SummaryReportHelper.safeNum(
                (users[userId][currencyId] || 0) + sum,
            );
        }

        Object.keys(users).forEach((unsafeId) => {
            const id = Number(unsafeId);

            Object.entries(users[id]).forEach(([currencyId, sum]) => {
                data.byUser.push({
                    sum,
                    description: SummaryReportHelper.description(
                        userIdToFullName[id],
                        { html },
                    ),
                    reference: JSON.stringify({ id, currencyId }),
                    currencyId,
                });
            });
        });

        SummaryReportHelper.addMLEntries({
            html,
            data: data.byML,
            mls,
            mlRecords,
        });

        return data;
    },

    async getExpensesData({
        expenseRecords,
        userRecords,
        mlRecords,
        currencyIdToISOCode,
        mlIdToCurrencyId,
        html,
    }) {
        const users = {};
        const mls = {};

        for (const rawRecord of expenseRecords) {
            const record = rawRecord.toJSON();
            let sum = record.sum;
            const recordUsers = record.users;
            const mlId = record.money_location_id;
            const currencyId = mlIdToCurrencyId[mlId];

            mls[mlId] = SummaryReportHelper.safeNum((mls[mlId] || 0) + sum);

            sum /= recordUsers.length;

            recordUsers.forEach((userId) => {
                users[userId] = users[userId] || {};
                users[userId][currencyId] = SummaryReportHelper.safeNum(
                    (users[userId][currencyId] || 0) + sum,
                );
            });
        }

        const data = {
            byUser: [],
            byML: [],
        };

        userRecords.forEach((user) => {
            const id = user.id;

            if (users[id]) {
                Object.entries(users[id]).forEach(([currencyId, sum]) => {
                    data.byUser.push({
                        sum,
                        description: SummaryReportHelper.description(
                            `${user.full_name} (${
                                currencyIdToISOCode[currencyId]
                            })`,
                            {
                                html,
                            },
                        ),
                        reference: JSON.stringify({ id, currencyId }),
                        currencyId,
                    });
                });
            }
        });

        SummaryReportHelper.addMLEntries({
            html,
            data: data.byML,
            mls,
            mlRecords,
        });

        return data;
    },

    async getExpensesByCategory({
        expenseRecords,
        mlIdToCurrencyId,
        categoryRecords,
        currencyIdToISOCode,
        userIdToFullName,
        html,
    }) {
        const categories = {};
        const data = [];
        const categoryIdToRecord = categoryRecords.reduce((acc, each) => {
            acc[each.id] = each;

            return acc;
        }, {});

        for (const record of expenseRecords) {
            const json = record.toJSON();
            const recordCategories = json.categories;
            const sum = json.sum;
            const currencyId = mlIdToCurrencyId[json.money_location_id];
            const addData = function (categoryId, rawCatSum) {
                if (!categories[categoryId]) {
                    categories[categoryId] = {
                        users: {},
                    };
                }

                const users = json.users;
                const catSum = rawCatSum / users.length;

                users.forEach((id) => {
                    categories[categoryId].users[id] =
                        categories[categoryId].users[id] || {};
                    categories[categoryId].users[id][currencyId] =
                        categories[categoryId].users[id][currencyId] || 0;
                    categories[categoryId].users[id][currencyId] += catSum;
                });
            };

            if (recordCategories.length > 0) {
                recordCategories.forEach((rawCategoryId) => {
                    let categoryId;

                    if (categoryIdToRecord[rawCategoryId]) {
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

            return categoryIdToRecord[id1].name > categoryIdToRecord[id2].name
                ? 1
                : -1;
        });

        categoryIds.forEach((categoryId, index) => {
            Object.entries(categories[categoryId].users).forEach(
                ([userId, currencies]) => {
                    Object.entries(currencies).forEach(([currencyId, sum]) => {
                        data.push({
                            sum,
                            description: SummaryReportHelper.description(
                                `${userIdToFullName[userId]} (${
                                    currencyIdToISOCode[currencyId]
                                })`,
                                { html },
                            ),
                            group: categoryId,
                            currencyId: Number(currencyId),
                            index,
                        });
                    });
                },
            );
        });

        return data;
    },
};
