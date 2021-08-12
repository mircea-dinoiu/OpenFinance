import {CrudController} from '../CrudController';
import {ExpenseService} from './ExpenseService';
import {pickOwnProperties} from '../helpers';
import ofx from 'ofx';
import moment from 'moment';
import {QueryTypes} from 'sequelize';
import {advanceRepeatDate} from '../../src/transactions/repeatedModels';
import {getDb} from '../getDb';
import {
    getExpenseModel,
    getCategoryModel,
    getUserModel,
    getAccountModel,
    getInventoryModel,
    getStockModel,
} from '../models';
import {FULL_DATE_FORMAT_TZ} from '../../src/app/dates/defs';
import {isPlainObject} from 'lodash';

export class ExpenseController extends CrudController {
    constructor() {
        super(getExpenseModel(), ExpenseService);

        this.updateValidationRules = {
            id: ['isRequired', 'isTransactionId'],

            price: ['sometimes', 'isRequired', 'isFloat', 'isPositive'],
            quantity: ['sometimes', 'isRequired', 'isFloat'],

            item: ['sometimes', 'isRequired', 'isString'],
            notes: ['sometimes', 'isString'],
            favorite: ['sometimes', 'isInt'],
            hidden: ['sometimes', 'isBool'],
            created_at: ['sometimes', 'isRequired', ['isDateFormat', FULL_DATE_FORMAT_TZ]],
            money_location_id: ['sometimes', ['isProjectBasedId', getAccountModel()]],
            status: ['sometimes', 'isRequired', 'isStatusValue'],
            users: ['sometimes', 'isRequired', ['isPercentageObject', getUserModel()]],
            categories: ['sometimes', ['isIdArray', getCategoryModel()]],

            repeat: ['sometimes', 'isRepeatValue'],
            repeat_occurrences: ['sometimes', 'isInt'],
            repeat_factor: ['sometimes', 'isInt', 'isNotZero'],

            stock_id: ['sometimes', ['isId', getStockModel()]],
            inventory_id: ['sometimes', ['isProjectBasedId', getInventoryModel()]],

            weight: ['sometimes', 'isPositive', 'isInt'],
        };
        this.createValidationRules = {
            price: ['isRequired', 'isFloat', 'isPositive'],
            quantity: ['isRequired', 'isFloat'],

            item: ['isRequired', 'isString'],
            notes: ['sometimes', 'isString'],
            favorite: ['sometimes', 'isInt'],
            hidden: ['sometimes', 'isBool'],
            users: ['isRequired', ['isPercentageObject', getUserModel()]],
            created_at: ['sometimes', 'isRequired', ['isDateFormat', FULL_DATE_FORMAT_TZ]],
            money_location_id: ['isRequired', ['isProjectBasedId', getAccountModel()]],
            status: ['sometimes', 'isRequired', 'isStatusValue'],
            fitid: ['sometimes', 'isRequired', 'isString'],
            categories: ['sometimes', ['isIdArray', getCategoryModel()]],

            repeat: ['sometimes', 'isRepeatValue'],
            repeat_occurrences: ['sometimes', 'isInt'],
            repeat_factor: ['sometimes', 'isInt', 'isNotZero'],

            stock_id: ['sometimes', ['isId', getStockModel()]],
            inventory_id: ['sometimes', ['isProjectBasedId', getInventoryModel()]],

            weight: ['sometimes', 'isPositive', 'isInt'],
        };
    }

    async updateRelations({record, model, req}) {
        return this.createRelations({record, model, req, cleanup: true});
    }

    getUsers(req) {
        return getDb().query(`select user_id as id from project_user where project_id = :projectId`, {
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
                    await getDb().query('DELETE FROM category_expense WHERE expense_id = ?', {
                        replacements: [m.id],
                    });
                }

                for (const id of record.categories) {
                    await getDb().query('INSERT INTO category_expense (category_id, expense_id) VALUES (?, ?)', {
                        replacements: [id, m.id],
                    });
                }
            }

            if (record.hasOwnProperty('users')) {
                if (cleanup) {
                    await getDb().query('DELETE FROM expense_user WHERE expense_id = ?', {
                        replacements: [m.id],
                    });
                }

                for (const user of users) {
                    await getDb().query(
                        'INSERT INTO expense_user (user_id, expense_id, blame, seen) VALUES (?, ?, ?, ?)',
                        {
                            replacements: [user.id, m.id, record.users[user.id] || 0, user.id === req.user.id],
                        },
                    );
                }
            }
        }
    }

    async withRepeatedModels({model, cleanup = false}) {
        const promises = [Promise.resolve(model)];

        if (cleanup) {
            await getDb().query('DELETE FROM expenses WHERE repeat_link_id = ?', {
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
            await getDb().query('UPDATE expenses SET repeat_link_id = NULL WHERE repeat_link_id = ?', {
                replacements: [model.id],
            });
        }

        return Promise.all(promises);
    }

    sanitizeValues(record, req, res) {
        const values: any = pickOwnProperties(record, [
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
        const accountId = Number(req.query.accountId);
        const projectId = req.projectId;
        const account = await getAccountModel().findOne({where: {id: accountId, project_id: projectId}});

        if (!account) {
            return res.sendStatus(400);
        }

        const transactions = mapOfxToTransactions(data).map(({DTPOSTED, TRNAMT, FITID, NAME}) => {
            const sum = Number(TRNAMT);

            return {
                money_location_id: accountId,
                project_id: req.projectId,
                fitid: FITID,
                item: NAME,
                status: 'pending',
                price: Math.abs(sum),
                quantity: sum < 0 ? -1 : 1,
                created_at: moment(DTPOSTED, 'YYYYMMDDHHmmss')
                    .parseZone()
                    .toISOString(),
                users: {
                    [account.owner_id ?? req.user.id]: 100,
                },
            };
        });

        return res.json({
            transactions,
        });
    }
}

const mapOfxToTransactions = (data) => {
    if (data?.BANKTRANLIST) {
        return data.BANKTRANLIST.STMTTRN;
    }

    if (isPlainObject(data)) {
        return Object.values(data).reduce((acc: any[], each) => {
            return acc.concat(mapOfxToTransactions(each));
        }, []);
    }

    return [];
};
