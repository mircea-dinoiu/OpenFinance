const BaseController = require('./BaseController');
const {sql} = require('../models');
const {Validator} = require('../validators');
const defs = require('../../src/js/defs');
const {QueryTypes} = require('sequelize');

const mapSearchToMatchAgainst = (search) =>
    search
        .split(/\W/)
        .filter(Boolean)
        .map((w) => `+${w}`)
        .join(' ');

module.exports = class SuggestionController extends BaseController {
    async getCategories(req, res) {
        const search = req.query.search;

        if ('string' === typeof search && search.trim().length) {
            const row = await sql.query(
                `
SELECT DISTINCT
   category_id 
FROM
   expenses 
   JOIN
      category_expense 
      ON category_expense.expense_id = expenses.id 
WHERE
   project_id = :projectId 
   AND MATCH(expenses.item) AGAINST(:search)`,
                {
                    replacements: {
                        projectId: req.projectId,
                        search: mapSearchToMatchAgainst(search),
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
                    `
SELECT
   item,
   COUNT(item) as usages 
FROM
   expenses 
WHERE
   (:search = '' OR MATCH(expenses.item) AGAINST(:search))
   AND created_at <= :endDate 
   AND project_id = :projectId 
GROUP BY
   item 
ORDER BY
   usages DESC LIMIT 10`,
                    {
                        replacements: {
                            endDate: query.end_date,
                            projectId: req.projectId,
                            search: mapSearchToMatchAgainst(query.search),
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
