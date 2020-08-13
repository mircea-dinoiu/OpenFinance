const {Expense: Model, User, MoneyLocation, Category} = require('../models');
const BaseController = require('./BaseController');
const Service = require('../services/ExpenseService');
const {pickOwnProperties} = require('../helpers');
const {sql} = require('../models');
const defs = require('../../src/js/defs');
const ofx = require('ofx');
const moment = require('moment');
const {QueryTypes} = require('sequelize');
const {advanceRepeatDate} = require('../../src/js/helpers/repeatedModels');

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
        repeat_occurrences: ['sometimes', 'isInt'],

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
        repeat_occurrences: ['sometimes', 'isNotZero', 'isInt'],

        weight: ['sometimes', 'isNotNegative', 'isInt'],
    };

    async updateRelations({record, model, req}) {
        return this.createRelations({record, model, req, cleanup: true});
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

    async createRelations({record, model, req, cleanup = false}) {
        const allModels = await this.withRepeatedModels({model, cleanup});
        const users = await this.getUsers(req);

        for (const m of allModels) {
            if (record.hasOwnProperty('categories')) {
                if (cleanup) {
                    await sql.query(
                        'DELETE FROM category_expense WHERE expense_id = ?',
                        {
                            replacements: [m.id],
                        },
                    );
                }

                for (const id of record.categories) {
                    await sql.query(
                        'INSERT INTO category_expense (category_id, expense_id) VALUES (?, ?)',
                        {
                            replacements: [id, m.id],
                        },
                    );
                }
            }

            if (record.hasOwnProperty('users')) {
                if (cleanup) {
                    await sql.query(
                        'DELETE FROM expense_user WHERE expense_id = ?',
                        {
                            replacements: [m.id],
                        },
                    );
                }

                for (const user of users) {
                    await sql.query(
                        'INSERT INTO expense_user (user_id, expense_id, blame, seen) VALUES (?, ?, ?, ?)',
                        {
                            replacements: [
                                user.id,
                                m.id,
                                record.users[user.id] || 0,
                                user.id === req.user.id,
                            ],
                        },
                    );
                }
            }
        }

        return this.Model.scope('default').findOne({where: {id: model.id}});
    }

    async withRepeatedModels({model, cleanup = false}) {
        const models = [model];

        if (model.repeat && model.repeat_occurrences) {
            if (cleanup) {
                await sql.query(
                    'DELETE FROM expenses WHERE repeat_link_id = ?',
                    {
                        replacements: [model.id],
                    },
                );
            }

            while (models[models.length - 1].repeat_occurrences > 0) {
                const prevModel = models[models.length - 1];
                const {id, ...record} = prevModel.dataValues;
                const payload = {
                    ...advanceRepeatDate(record),
                    repeat_occurrences: prevModel.repeat_occurrences - 1,
                    repeat_link_id: prevModel.id,
                };

                models.push(await this.Model.create(payload));
            }
        } else if (cleanup) {
            await sql.query(
                'UPDATE expenses SET repeat_link_id = NULL WHERE repeat_link_id = ?',
                {
                    replacements: [model.id],
                },
            );
        }

        return models;
    }

    sanitizeValues(record, req, res) {
        const values = pickOwnProperties(record, [
            'sum',
            'money_location_id',
            'weight',
            'fitid',
            'favorite',
            'hidden',
            'created_at',
            'repeat',
            'repeat_occurrences',
        ]);

        if (record.hasOwnProperty('item')) {
            values.item = record.item.trim();
        }

        if (record.hasOwnProperty('status') && values.status == null) {
            values.status = record.status;
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

    async destroyModel(model) {
        await sql.query('DELETE FROM expenses WHERE repeat_link_id = ?', {
            replacements: [model.id],
        });

        return super.destroyModel(model);
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

        return res.json({
            transactions,
        });
    }
};
