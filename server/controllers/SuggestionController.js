const BaseController = require('./BaseController');
const {Expense, sql} = require('../models');
const {Validator} = require('../validators');
const {extractIdsFromModel} = require('../helpers');
const defs = require('../../src/js/defs');

module.exports = class SuggestionController extends BaseController {
    async getCategories(req, res) {
        const search = req.query.search;
        let ret = [];

        if ('string' === typeof search && search.length) {
            const response = await Expense.scope('default').findAll({
                where: [
                    'lower(item) = ? AND expenses.project_id = ?',
                    search.toLowerCase().trim(),
                    req.projectId,
                ],
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
    }

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
                        'created_at <= ? AND LOWER(item) LIKE ? AND project_id = ?',
                        query.end_date,
                        `%${query.search}%`,
                        req.projectId,
                    ],
                    group: 'item',
                    order: 'usages DESC LIMIT 10',
                }),
            );
        } else {
            res.status(400).json(validator.errors());
        }
    }
};
