const {
    Expense: Model,
    User,
    MoneyLocation,
    Category,
    ExpenseUser,
} = require('../models');
const BaseController = require('./BaseController');
const Service = require('../services/ExpenseService');
const {pickOwnProperties} = require('../helpers');
const {sql} = require('../models');
const defs = require('../../src/js/defs');
const ofx = require('ofx');
const moment = require('moment');
const {QueryTypes} = require('sequelize');

module.exports = class ExpenseController extends BaseController {
    Model = Model;
    Service = Service;
    updateValidationRules = {
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
    };
    createValidationRules = {
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
        fitid: ['sometimes', 'isRequired', 'isString'],
        categories: ['sometimes', ['isIdArray', Category]],

        repeat: ['sometimes', 'isRepeatValue'],
        repeat_end_date: ['sometimes', 'isInt'],
        repeat_occurrences: ['sometimes', 'isNotZero', 'isInt'],

        weight: ['sometimes', 'isNotNegative', 'isInt'],
    };

    async updateRelations({record, model, req}) {
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
            const users = await this.getUsers(req);

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
    }

    getUsers(req) {
        return sql.query(
            `select user_id as id from project_user where project_id = :projectId`,
            {
                replacements: {
                    projectId: req.projectId,
                },
                type: QueryTypes.SELECT,
            },
        );
    }

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

        const users = await this.getUsers(req);

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
    }

    sanitizeValues(record, req, res) {
        const values = pickOwnProperties(record, [
            'sum',
            'money_location_id',
            'repeat_occurrences',
            'weight',
            'fitid',
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
                if (record.status === 'finished') {
                    values.status = 'pending';
                }
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

        values.project_id = req.projectId;

        return values;
    }

    sanitizeCreateValues(record, req, res) {
        return this.sanitizeValues(record, req, res);
    }

    sanitizeUpdateValues(record, req, res) {
        return this.sanitizeValues(record, req, res);
    }

    /**
     * @param req
     * @param res
     * @returns A list of transactions that can be POSTed to the main API
     */
    async upload({req, res}) {
        const {file} = req.files;

        const data = ofx.parse(file.data.toString());

        const transactions = data.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS.BANKTRANLIST.STMTTRN.map(
            ({DTPOSTED, TRNAMT, FITID, NAME}) => {
                return {
                    money_location_id: Number(req.query.accountId),
                    project_id: req.projectId,
                    fitid: FITID,
                    item: NAME,
                    status: 'pending',
                    sum: Number(TRNAMT),
                    created_at: moment(DTPOSTED, 'YYYYMMDDHHmmss')
                        .parseZone()
                        .toISOString(),
                    users: {
                        [req.user.id]: 100,
                    },
                };
            },
        );

        /*await Model.bulkCreate(transactions, {
            ignoreDuplicates: true,
        });

        const imported = await Model.findAll({
            attributes: ['id'],
            where: {
                fitid: {
                    $in: transactions.map((t) => t.fitid),
                },
            },
        });

        await ExpenseUser.bulkCreate(
            imported.map((t) => ({
                expense_id: t.id,
                user_id: req.user.id,
                blame: 1,
                seen: 1,
            })),
        );*/

        return res.json({
            transactions,
        });
    }
};
