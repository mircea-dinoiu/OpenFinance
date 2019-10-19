const {Expense: Model, User, MoneyLocation, Category} = require('../models');
const BaseController = require('./BaseController');
const Service = require('../services/ExpenseService');
const {pickOwnProperties} = require('../helpers');
const {sql} = require('../models');
const defs = require('../../src/js/defs');

module.exports = BaseController.extend({
    Model,
    Service,

    updateValidationRules: {
        id: ['isRequired', ['isId', Model]],
        sum: ['sometimes', 'isRequired', 'isFloat'],
        item: ['sometimes', 'isRequired', 'isString'],
        favorite: ['sometimes', 'isInt'],
        hidden: ['sometimes', 'isBool'],
        created_at: [
            'sometimes',
            'isRequired',
            ['isDateFormat', defs.FULL_DATE_FORMAT_TZ],
        ],
        money_location_id: ['sometimes', ['isId', MoneyLocation]],
        status: ['sometimes', 'isRequired', 'isStatusValue'],
        users: ['sometimes', 'isRequired', ['isPercentageObject', User]],
        categories: ['sometimes', ['isIdArray', Category]],

        repeat: ['sometimes', 'isRepeatValue'],
        repeat_end_date: ['sometimes', 'isInt'],
        repeat_occurrences: ['sometimes', 'isNotZero', 'isInt'],

        weight: ['sometimes', 'isNotNegative', 'isInt'],
    },

    createValidationRules: {
        sum: ['isRequired', 'isFloat'],
        item: ['isRequired', 'isString'],
        favorite: ['sometimes', 'isInt'],
        hidden: ['sometimes', 'isBool'],
        users: ['isRequired', ['isPercentageObject', User]],
        created_at: [
            'sometimes',
            'isRequired',
            ['isDateFormat', defs.FULL_DATE_FORMAT_TZ],
        ],
        money_location_id: ['isRequired', ['isId', MoneyLocation]],
        status: ['sometimes', 'isRequired', 'isStatusValue'],
        categories: ['sometimes', ['isIdArray', Category]],

        repeat: ['sometimes', 'isRepeatValue'],
        repeat_end_date: ['sometimes', 'isInt'],
        repeat_occurrences: ['sometimes', 'isNotZero', 'isInt'],

        weight: ['sometimes', 'isNotNegative', 'isInt'],
    },

    async updateRelations({record, model}) {
        if (record.hasOwnProperty('categories')) {
            await sql.query(
                'DELETE FROM category_expense WHERE expense_id = ?',
                {
                    replacements: [model.id],
                },
            );

            for (const id of record.categories) {
                await sql.query(
                    'INSERT INTO category_expense (category_id, expense_id) VALUES (?, ?)',
                    {
                        replacements: [id, model.id],
                    },
                );
            }
        }

        if (record.hasOwnProperty('users')) {
            const users = await User.findAll();

            for (const user of users) {
                await sql.query(
                    'UPDATE expense_user SET blame = ? WHERE expense_id = ? AND user_id = ?',
                    {
                        replacements: [
                            record.users[user.id] || 0,
                            model.id,
                            user.id,
                        ],
                    },
                );
            }
        }

        return this.Model.scope('default').findOne({where: {id: model.id}});
    },

    async createRelations({record, model, req}) {
        if (record.hasOwnProperty('categories')) {
            for (const id of record.categories) {
                await sql.query(
                    'INSERT INTO category_expense (category_id, expense_id) VALUES (?, ?)',
                    {
                        replacements: [id, model.id],
                    },
                );
            }
        }

        const users = await User.findAll();

        for (const user of users) {
            await sql.query(
                'INSERT INTO expense_user (user_id, expense_id, blame, seen) VALUES (?, ?, ?, ?)',
                {
                    replacements: [
                        user.id,
                        model.id,
                        record.users[user.id] || 0,
                        user.id === req.user.id,
                    ],
                },
            );
        }

        return this.Model.scope('default').findOne({where: {id: model.id}});
    },

    sanitizeValues(record) {
        const values = pickOwnProperties(record, [
            'sum',
            'money_location_id',
            'repeat_occurrences',
            'weight',
        ]);

        if (record.hasOwnProperty('item')) {
            values.item = record.item.trim();
        }

        if (record.hasOwnProperty('favorite')) {
            values.favorite = record.favorite;
        }

        if (record.hasOwnProperty('hidden')) {
            values.hidden = record.hidden;
        }

        if (record.hasOwnProperty('created_at')) {
            values.created_at = record.created_at;
        }

        if (record.hasOwnProperty('repeat')) {
            values.repeat = record.repeat;

            if (values.repeat != null) {
                values.status = 'pending';
            } else {
                values.repeat_occurrences = null;
                values.repeat_end_date = null;
            }
        }

        if (record.hasOwnProperty('status') && values.status == null) {
            values.status = record.status;

            if (values.status === 'finished') {
                values.repeat = null;
            }
        }

        return values;
    },

    sanitizeCreateValues(record) {
        return this.sanitizeValues(record);
    },

    sanitizeUpdateValues(record) {
        return this.sanitizeValues(record);
    },
});
