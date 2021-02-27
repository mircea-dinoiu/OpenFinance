const {Expense: Model, User, Stock, MoneyLocation, Category, Inventory} = require('../models');
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
    constructor() {
        super();

        this.Model = Model;
        this.Service = Service;
        this.updateValidationRules = {
            id: ['isRequired', 'isTransactionId'],

            price: ['sometimes', 'isRequired', 'isFloat'],
            quantity: ['sometimes', 'isRequired', 'isFloat'],

            item: ['sometimes', 'isRequired', 'isString'],
            notes: ['sometimes', 'isString'],
            favorite: ['sometimes', 'isInt'],
            hidden: ['sometimes', 'isBool'],
            created_at: ['sometimes', 'isRequired', ['isDateFormat', defs.FULL_DATE_FORMAT_TZ]],
            money_location_id: ['sometimes', ['isId', MoneyLocation]],
            status: ['sometimes', 'isRequired', 'isStatusValue'],
            users: ['sometimes', 'isRequired', ['isPercentageObject', User]],
            categories: ['sometimes', ['isIdArray', Category]],

            repeat: ['sometimes', 'isRepeatValue'],
            repeat_occurrences: ['sometimes', 'isInt'],
            repeat_factor: ['sometimes', 'isInt', 'isNotZero'],

            stock_id: ['sometimes', ['isId', Stock]],
            inventory_id: ['sometimes', ['isId', Inventory]],

            weight: ['sometimes', 'isPositive', 'isInt'],
        };
        this.createValidationRules = {
            price: ['isRequired', 'isFloat'],
            quantity: ['isRequired', 'isFloat'],

            item: ['isRequired', 'isString'],
            notes: ['sometimes', 'isString'],
            favorite: ['sometimes', 'isInt'],
            hidden: ['sometimes', 'isBool'],
            users: ['isRequired', ['isPercentageObject', User]],
            created_at: ['sometimes', 'isRequired', ['isDateFormat', defs.FULL_DATE_FORMAT_TZ]],
            money_location_id: ['isRequired', ['isId', MoneyLocation]],
            status: ['sometimes', 'isRequired', 'isStatusValue'],
            fitid: ['sometimes', 'isRequired', 'isString'],
            categories: ['sometimes', ['isIdArray', Category]],

            repeat: ['sometimes', 'isRepeatValue'],
            repeat_occurrences: ['sometimes', 'isInt'],
            repeat_factor: ['sometimes', 'isInt', 'isNotZero'],

            stock_id: ['sometimes', ['isId', Stock]],
            inventory_id: ['sometimes', ['isId', Inventory]],

            weight: ['sometimes', 'isPositive', 'isInt'],
        };
    }

    async updateRelations({record, model, req}) {
        return this.createRelations({record, model, req, cleanup: true});
    }

    getUsers(req) {
        return sql.query(`select user_id as id from project_user where project_id = :projectId`, {
            replacements: {
                projectId: req.projectId,
            },
            type: QueryTypes.SELECT,
        });
    }

    async createRelations({record, model, req, cleanup = false}) {
        const allModels = await this.withRepeatedModels({model, cleanup});
        const users = await this.getUsers(req);

        for (const m of allModels) {
            if (record.hasOwnProperty('categories')) {
                if (cleanup) {
                    await sql.query('DELETE FROM category_expense WHERE expense_id = ?', {
                        replacements: [m.id],
                    });
                }

                for (const id of record.categories) {
                    await sql.query('INSERT INTO category_expense (category_id, expense_id) VALUES (?, ?)', {
                        replacements: [id, m.id],
                    });
                }
            }

            if (record.hasOwnProperty('users')) {
                if (cleanup) {
                    await sql.query('DELETE FROM expense_user WHERE expense_id = ?', {
                        replacements: [m.id],
                    });
                }

                for (const user of users) {
                    await sql.query('INSERT INTO expense_user (user_id, expense_id, blame, seen) VALUES (?, ?, ?, ?)', {
                        replacements: [user.id, m.id, record.users[user.id] || 0, user.id === req.user.id],
                    });
                }
            }
        }
    }

    async withRepeatedModels({model, cleanup = false}) {
        const promises = [Promise.resolve(model)];

        if (cleanup) {
            await sql.query('DELETE FROM expenses WHERE repeat_link_id = ?', {
                replacements: [model.id],
            });
        }

        if (model.repeat && model.repeat_occurrences) {
            let occurrences = model.repeat_occurrences;
            let repeats = 1;

            while (occurrences > 1) {
                const {id, ...record} = model.dataValues;
                const repeatOccurrences = occurrences - 1;
                const payload = {
                    ...record,
                    created_at: advanceRepeatDate(record, repeats),
                    repeat_occurrences: repeatOccurrences,
                    repeat: repeatOccurrences ? record.repeat : null,
                    repeat_link_id: model.id,
                };

                repeats++;
                occurrences--;

                promises.push(this.Model.create(payload));
            }
        } else if (cleanup) {
            await sql.query('UPDATE expenses SET repeat_link_id = NULL WHERE repeat_link_id = ?', {
                replacements: [model.id],
            });
        }

        return Promise.all(promises);
    }

    sanitizeValues(record, req, res) {
        const values = pickOwnProperties(record, [
            'price',
            'money_location_id',
            'stock_id',
            'inventory_id',
            'quantity',
            'weight',
            'fitid',
            'favorite',
            'hidden',
            'created_at',
            'repeat',
            'repeat_occurrences',
            'repeat_factor',
            'notes',
        ]);

        if (record.hasOwnProperty('item')) {
            values.item = record.item.trim();
        }

        /**
         * repeat and repeat_occurrences need to be in sync
         * when repeat is falsy, repeat_occurrences needs to be 0
         * when repeat_occurrences is <2, repeat needs to be null
         */
        if (values.repeat === null) {
            values.repeat_occurrences = null;
            values.repeat_factor = 1;
        } else if (values.repeat_occurrences < 2) {
            values.repeat_occurrences = null;
            values.repeat = null;
            values.repeat_factor = 1;
        }

        if (record.hasOwnProperty('stock_id') && !values.stock_id) {
            values.stock_id = null;
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
                    price: Number(TRNAMT),
                    quantity: 1,
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
