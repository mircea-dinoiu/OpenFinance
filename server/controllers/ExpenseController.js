const { Expense: Model, User, MoneyLocation, Category } = require('../models');
const BaseController = require('./BaseController');
const Service = require('../services/ExpenseService');
const { pickOwnProperties } = require('../helpers');
const { sql } = require('../models');
const defs = require('../../shared/defs');

module.exports = BaseController.extend({
    Model,
    Service,

    updateValidationRules: {
        id: ['isRequired', ['isId', Model]],
        sum: ['sometimes', 'isRequired', 'isFloat', 'isHTZero'],
        item: ['sometimes', 'isRequired', 'isString'],
        notes: ['sometimes', 'isString'],
        favorite: ['sometimes', 'isBool'],
        hidden: ['sometimes', 'isBool'],
        created_at: [
            'sometimes',
            'isRequired',
            ['isDateFormat', defs.FULL_DATE_FORMAT_TZ],
        ],
        money_location_id: ['sometimes', ['isId', MoneyLocation]],
        status: ['sometimes', 'isRequired', 'isStatusValue'],
        type: ['sometimes', 'isRequired', 'isTypeValue'],
        users: ['sometimes', 'isRequired', ['isIdArray', User]],
        categories: ['sometimes', ['isIdArray', Category]],

        repeat: ['sometimes', 'isRepeatValue'],
        repeat_end_date: ['sometimes', 'isInt'],
        repeat_occurrences: ['sometimes', 'isNotZero', 'isInt'],
    },

    createValidationRules: {
        sum: ['isRequired', 'isFloat', 'isNotZero'],
        item: ['isRequired', 'isString'],
        notes: ['sometimes', 'isString'],
        favorite: ['sometimes', 'isBool'],
        hidden: ['sometimes', 'isBool'],
        users: ['isRequired', ['isIdArray', User]],
        created_at: [
            'sometimes',
            'isRequired',
            ['isDateFormat', defs.FULL_DATE_FORMAT_TZ],
        ],
        money_location_id: ['isRequired', ['isId', MoneyLocation]],
        categories: ['sometimes', ['isIdArray', Category]],

        repeat: ['sometimes', 'isRepeatValue'],
        repeat_end_date: ['sometimes', 'isInt'],
        repeat_occurrences: ['sometimes', 'isNotZero', 'isInt'],
    },

    async updateRelations({ record, model }) {
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
                            record.users.includes(user.id),
                            model.id,
                            user.id,
                        ],
                    },
                );
            }
        }

        return this.Model.scope('default').findOne({ where: { id: model.id } });
    },

    async createRelations({ record, model, req }) {
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
                        record.users.includes(user.id),
                        user.id === req.user.id,
                    ],
                },
            );
        }

        return this.Model.scope('default').findOne({ where: { id: model.id } });
    },

    sanitizeCreateValues(record) {
        const values = pickOwnProperties(record, [
            'sum',
            'repeat',
            'money_location_id',
            'repeat_occurrences',
        ]);

        values.status = record.status || 'pending';

        if (record.hasOwnProperty('item')) {
            values.item = record.item.trim();
        }

        if (record.hasOwnProperty('notes')) {
            values.notes = record.notes && record.notes.trim();
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

        return values;
    },

    sanitizeUpdateValues(record) {
        const workingRecord = Object.assign({}, record);
        const values = pickOwnProperties(workingRecord, [
            'sum',
            'money_location_id',
            'repeat_occurrences',
        ]);

        if (workingRecord.hasOwnProperty('item')) {
            values.item = workingRecord.item.trim();
        }

        if (workingRecord.hasOwnProperty('notes')) {
            values.notes = workingRecord.notes && workingRecord.notes.trim();
        }

        if (workingRecord.hasOwnProperty('hidden')) {
            values.hidden = workingRecord.hidden;
        }

        if (workingRecord.hasOwnProperty('favorite')) {
            values.favorite = workingRecord.favorite;
        }

        if (workingRecord.hasOwnProperty('created_at')) {
            values.created_at = workingRecord.created_at;
        }

        if (workingRecord.hasOwnProperty('repeat')) {
            values.repeat = workingRecord.repeat;

            if (values.repeat != null) {
                values.status = 'pending';
            } else {
                values.repeat_occurrences = null;
                values.repeat_end_date = null;
            }
        }

        if (workingRecord.hasOwnProperty('type')) {
            values.type = record.type;
        }

        if (workingRecord.hasOwnProperty('status')) {
            values.status = record.status;

            if (values.status === 'finished') {
                values.repeat = null;
            }
        }

        return values;
    },
});
