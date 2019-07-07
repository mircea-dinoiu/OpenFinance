const BaseController = require('./BaseController');
const {Expense, sql} = require('../models');
const {Validator} = require('../validators');
const {extractIdsFromModel} = require('../helpers');
const defs = require('../../shared/defs');

module.exports = BaseController.extend({
    async getCategories(req, res) {
        const search = req.query.search;
        let ret = [];

        if ('string' === typeof search && search.length) {
            const response = await Expense.scope('default').findAll({
                where: sql.where(
                    sql.fn('lower', sql.col('item')),
                    search.toLowerCase().trim(),
                ),
                order: [[sql.col('created_at'), 'DESC']],
            });

            for (const record of response) {
                const categories = extractIdsFromModel(record, 'categoryIds');

                if (categories.length) {
                    ret = categories;
                    break;
                }
            }
        }

        res.json(ret);
    },

    async getExpenseDescriptions(req, res) {
        const {query} = req;
        const validator = new Validator(query, {
            search: ['isString'],
            end_date: [
                'isRequired',
                ['isDateFormat', defs.FULL_DATE_FORMAT_TZ],
            ],
        });

        if (await validator.passes()) {
            res.json(
                await Expense.findAll({
                    attributes: ['item', [sql.fn('COUNT', 'item'), 'usages']],
                    where: [
                        'created_at <= ? AND LOWER(item) LIKE ?',
                        query.end_date,
                        `%${query.search}%`,
                    ],
                    group: 'item',
                    order: 'usages DESC LIMIT 10',
                }),
            );
        } else {
            res.status(400).json(validator.errors());
        }
    },
});
