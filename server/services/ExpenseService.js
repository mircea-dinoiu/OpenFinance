const {pick} = require('lodash');
const {Validator} = require('../validators');
const {Expense: Model, sql} = require('../models');
const {sanitizeFilters, sanitizeSorters} = require('../helpers');
const defs = require('../../src/js/defs');
const {
    mapStartDateToSQL,
    mapEndDateToSQL,
    mapTextFilterToSQL,
    mapFlagsToSQL,
    mapSortersToSQL,
    mapInputToLimitSQL,
    mapGroupConcatToHavingSQL,
    mapEntityFilterToWhereSQL,
} = require('../helpers/sql');

module.exports = {
    async list(req) {
        const {query} = req;
        const input = pick(
            query,
            'start_date',
            'end_date',
            'filters',
            'page',
            'limit',
            'sorters',
        );
        const rules = {
            start_date: [
                'sometimes',
                ['isDateFormat', defs.FULL_DATE_FORMAT_TZ],
            ],
            end_date: [
                'isRequired',
                ['isDateFormat', defs.FULL_DATE_FORMAT_TZ],
            ],
            filters: [
                'sometimes',
                [
                    'isTableFilters',
                    [...Object.keys(Model.attributes), 'categories', 'users'],
                ],
            ],
            page: ['sometimes', 'isInt'],
            limit: ['sometimes', 'isInt'],
            sorters: [
                'sometimes',
                ['isTableSorters', Model, ['money_location.currency_id']],
            ],
        };
        const validator = new Validator(input, rules, {req});

        if (await validator.passes()) {
            const where = [
                {
                    project_id: Number(query.projectId),
                },
            ];
            let having = [];

            where.push(mapStartDateToSQL(input.start_date, Model));
            where.push(mapEndDateToSQL(input.end_date, Model));

            sanitizeFilters(input.filters).forEach(({id, value}) => {
                switch (id) {
                    case 'item':
                        where.push(mapTextFilterToSQL(['item', 'notes'], value.text));
                        where.push(mapFlagsToSQL(value));
                        break;
                    case 'categories':
                        having.push(
                            mapGroupConcatToHavingSQL(
                                value,
                                'categoryIds',
                                'categories.category_expense.category_id',
                            ),
                        );
                        break;
                    case 'users':
                        having.push(
                            mapGroupConcatToHavingSQL(
                                value,
                                'userIds',
                                'users.expense_user.user_id',
                            ),
                        );
                        break;
                    case 'money_location_id':
                        where.push(
                            mapEntityFilterToWhereSQL(
                                value,
                                'money_location_id',
                            ),
                        );
                        break;
                    default:
                        where.push({
                            [id]: {
                                $eq: value,
                            },
                        });
                        break;
                }
            });

            const queryOpts = {
                where: sql.and(...where.filter(Boolean)),
            };

            having = having.filter(Boolean);

            if (having.length) {
                queryOpts.having = sql.and(...having);
            }

            const sorters = sanitizeSorters(input.sorters);

            queryOpts.order =
                mapSortersToSQL(sorters) + mapInputToLimitSQL(input);

            return {
                error: false,
                json: await Model.scope('default').findAll(queryOpts),
            };
        }

        return {
            error: true,
            json: validator.errors(),
        };
    },
};
