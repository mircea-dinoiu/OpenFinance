const ExpenseController = require('./ExpenseController');
const IncomeController = require('./IncomeController');
const CurrencyController = require('./CurrencyController');
const {User, MoneyLocation} = require('../models');

const description = (text) => {
    return `<span data-qtip="${text}">${text}</span>`;
};

module.exports = {
    async getList(req, res) {
        let [
            expenseRecords,
            incomeRecords,
            userRecords,
            mlRecords,
            defaultCurrency
        ] = await Promise.all([
            ExpenseController.getList(req, res),
            IncomeController.getList(req, res),
            User.findAll(),
            MoneyLocation.findAll(),
            CurrencyController.getDefaultCurrency()
        ]);

        const ret = {
            expensesData: await this.getExpensesData({
                expenseRecords,
                userRecords,
                mlRecords,
                defaultCurrency
            })
        };

        return ret;
    },

    async getExpensesData({expenseRecords, userRecords, mlRecords, defaultCurrency}) {
        const users = {};
        const mls = {};

        for (const record of expenseRecords) {
            let sum = record.sum;
            const recordUsers = record.users;
            const currencyId = record.currency_id;
            const mlId = record.money_location_id || 0;

            if (currencyId !== parseInt(defaultCurrency.id)) {
                console.log(`[DEBUG] Converting ${sum} (${currencyId} => ${defaultCurrency.id})`);
                sum = await CurrencyController.convertToDefault(sum, currencyId);
                console.log(`Resulted ${sum}`);
            }

            mls[mlId] = (mls[mlId] || 0) + sum;

            sum /= recordUsers.length;

            recordUsers.forEach(user => {
                const userId = user.id;

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

        mlRecords.forEach(record => {
            const id = record.id;

            if (mls[id]) {
                push(id, record.name, record.type_id);
            }
        });
    }
};