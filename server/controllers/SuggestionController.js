const BaseController = require('./BaseController');
const {sql} = require('../models');
const {Validator} = require('../validators');
const defs = require('../../src/js/defs');
const {QueryTypes} = require('sequelize');

module.exports = class SuggestionController extends BaseController {
    async getCategories(req, res) {
        const search = req.query.search;

        if ('string' === typeof search && search.length) {
            const row = await sql.query(
                `SELECT DISTINCT category_id FROM expenses JOIN category_expense ON category_expense.expense_id = expenses.id WHERE project_id = :projectId AND expenses.item = LOWER(TRIM(:search))`,
                {
                    replacements: {
                        projectId: req.projectId,
                        search: search,
                    },
                    type: QueryTypes.SELECT,
                },
            );

            return res.json({
                suggestions: row.map((row) => row.category_id),
            });
        }

        res.json({suggestions: []});
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
            res.json({
                suggestions: await sql.query(
                    `SELECT item, COUNT(item) as usages FROM expenses WHERE item LIKE :search AND created_at <= :endDate AND project_id = :projectId GROUP BY item ORDER BY usages DESC LIMIT 10`,
                    {
                        replacements: {
                            endDate: query.end_date,
                            projectId: req.projectId,
                            search: `%${query.search}%`,
                        },
                        type: QueryTypes.SELECT,
                    },
                ),
            });
        } else {
            res.status(400).json(validator.errors());
        }
    }
};
