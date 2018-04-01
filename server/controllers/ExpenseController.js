const {Expense: Model, User, Currency, MoneyLocation, Category} = require('../models');
const BaseController = require('./BaseController');
const CurrencyController = require('./CurrencyController');
const Service = require('../services/ExpenseService');
const {pickOwnProperties, standardDate} = require('../helpers');
const {sql} = require('../models');

module.exports = BaseController.extend({
    Model,
    Service,

    parseRecord(record) {
        const workingRecord = Object.assign({}, record);

        if (workingRecord.hasOwnProperty('money_location_id') && workingRecord.money_location_id == 0) {
            workingRecord.money_location_id = null;
        }

        return workingRecord;
    },

    updateValidationRules: {
        id: ['isRequired', ['isId', Model]],
        sum: ['sometimes', 'isRequired', 'isFloat', 'isNotZero'],
        item: ['sometimes', 'isRequired', 'isString'],
        repeat: ['sometimes', 'isRepeatValue'],
        created_at: ['sometimes', 'isRequired', 'isInt'],
        currency_id: ['sometimes', 'isRequired', ['isId', Currency]],
        money_location_id: ['sometimes', ['isId', MoneyLocation]],
        status: ['sometimes', 'isRequired', 'isStatusValue'],
        users: ['sometimes', 'isRequired', ['isIdArray', User]],
        categories: ['sometimes', ['isIdArray', Category]]
    },

    createValidationRules: {
        sum: ['isRequired', 'isFloat', 'isNotZero'],
        item: ['isRequired', 'isString'],
        repeat: ['sometimes', 'isRepeatValue'],
        users: ['isRequired', ['isIdArray', User]],
        created_at: ['sometimes', 'isRequired', 'isInt'],
        currency_id: ['sometimes', 'isRequired', ['isId', Currency]],
        money_location_id: ['sometimes', ['isId', MoneyLocation]],
        categories: ['sometimes', ['isIdArray', Category]]
    },

    async updateRelations({record, model}) {
        if (record.hasOwnProperty('categories')) {
            await sql.query('DELETE FROM category_expense WHERE expense_id = ?', {
                replacements: [model.id]
            });

            for (const id of record.categories) {
                await sql.query('INSERT INTO category_expense (category_id, expense_id) VALUES (?, ?)', {
                    replacements: [id, model.id]
                });
            }
        }

        if (record.hasOwnProperty('users')) {
            const users = await User.findAll();

            for (const user of users) {
                await sql.query('UPDATE expense_user SET blame = ? WHERE expense_id = ? AND user_id = ?', {
                    replacements: [
                        record.users.includes(user.id),
                        model.id,
                        user.id
                    ]
                });
            }
        }

        return this.Model.scope('default').findOne({where: {id: model.id}});
    },

    async createRelations({record, model, req}) {
        if (record.hasOwnProperty('categories')) {
            for (const id of record.categories) {
                await sql.query('INSERT INTO category_expense (category_id, expense_id) VALUES (?, ?)', {
                    replacements: [id, model.id]
                });
            }
        }

        const users = await User.findAll();

        for (const user of users) {
            await sql.query('INSERT INTO expense_user (user_id, expense_id, blame, seen) VALUES (?, ?, ?, ?)', {
                replacements: [user.id, model.id, record.users.includes(user.id), user.id === req.user.id]
            })
        }

        return this.Model.scope('default').findOne({where: {id: model.id}});
    },

    async sanitizeCreateValues(record) {
        const values = pickOwnProperties(record, [
            'sum',
            'repeat',
            'money_location_id'
        ]);

        values.status = 'pending';

        if (record.hasOwnProperty('item')) {
            values.item = record.item.trim();
        }

        if (record.hasOwnProperty('currency_id')) {
            values.currency_id = record.currency_id;
        } else {
            const defaultCurrency = await CurrencyController.getDefaultCurrency();

            values.currency_id = defaultCurrency.id;
        }

        if (record.hasOwnProperty('created_at')) {
            values.created_at = standardDate(record.created_at, 'X');
        }

        return values;
    },

    async sanitizeUpdateValues(record, model) {
        const workingRecord = Object.assign({}, record);
        const values = pickOwnProperties(workingRecord, [
            'sum',
            'money_location_id',
        ]);

        if (workingRecord.hasOwnProperty('item')) {
            values.item = workingRecord.item.trim();
        }

        if (workingRecord.hasOwnProperty('created_at')) {
            values.created_at = standardDate(workingRecord.created_at, 'X');
        }

        if (workingRecord.hasOwnProperty('repeat')) {
            values.repeat = workingRecord.repeat;

            if (values.repeat != null) {
                values.status = 'pending';
            }
        }

        if (workingRecord.hasOwnProperty('currency_id')) {
            values.currency_id = workingRecord.currency_id;
        }

        if (workingRecord.hasOwnProperty('status')) {
            values.status = record.status;

            if (values.status === 'finished') {
                values.repeat = null;
            }
        }

        return values;
    }
});