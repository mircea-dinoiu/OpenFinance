const { pick } = require('lodash');
const { Validator } = require('../validators');
const { Expense: Model, sql } = require('../models');
const RepeatedModelsHelper = require('../helpers/RepeatedModelsHelper');
const { sanitizeFilters, sanitizeSorters } = require('../helpers');
const defs = require('../../shared/defs');
const {
    mapStartDateToSQL,
    mapEndDateToSQL,
    mapTextFilterToSQL,
    mapFlagsToSQL,
    mapSortersToSQL,
    mapInputToLimitSQL,
} = require('../helpers/sql');

module.exports = {
    async list(query) {
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
            start_date: ['sometimes', ['isDateFormat', defs.FULL_DATE_FORMAT_TZ]],
            end_date: ['isRequired', ['isDateFormat', defs.FULL_DATE_FORMAT_TZ]],
            filters: [
                'sometimes',
                [
                    'isTableFilters',
                    [...Object.keys(Model.attributes), 'categories', 'users'],
                ],
            ],
            page: ['sometimes', 'isInt'],
            limit: ['sometimes', 'isInt'],
            sorters: ['sometimes', ['isTableSorters', Model]],
        };
        const validator = new Validator(input, rules);

        if (await validator.passes()) {
            const where = [];

            where.push(mapStartDateToSQL(input.start_date, Model));
            where.push(mapEndDateToSQL(input.end_date, Model));

            let displayGenerated = 'yes';

            sanitizeFilters(input.filters).forEach(({ id, value }) => {
                switch (id) {
                    case 'item':
                        where.push(mapTextFilterToSQL(id, value.text));
                        where.push(mapFlagsToSQL(value));

                        if (value.Generated) {
                            displayGenerated = value.Generated;
                        }
                        break;
                    case 'categories':
                        if (Array.isArray(value)) {
                            where.push(
                                sql.where(
                                    sql.col(
                                        'categories.category_expense.category_id',
                                    ),
                                    {
                                        $in: value,
                                    },
                                ),
                            );
                        } else if (value === 'none') {
                            where.push(
                                sql.where(
                                    sql.col(
                                        'categories.category_expense.category_id',
                                    ),
                                    {
                                        $is: sql.literal('NULL'),
                                    },
                                ),
                            );
                        }
                        break;
                    case 'users':
                        if (Array.isArray(value)) {
                            where.push(
                                sql.where(
                                    sql.col('users.expense_user.user_id'),
                                    {
                                        $in: value,
                                    },
                                ),
                            );
                        } else if (value === 'none') {
                            where.push(
                                sql.where(
                                    sql.col('users.expense_user.user_id'),
                                    {
                                        $is: sql.literal('NULL'),
                                    },
                                ),
                            );
                        }
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

            const sorters = sanitizeSorters(input.sorters);

            queryOpts.order =
                mapSortersToSQL(sorters) + mapInputToLimitSQL(input);

            return {
                error: false,
                json: RepeatedModelsHelper.filterClones(
                    RepeatedModelsHelper.generateClones({
                        records: await Model.scope('default').findAll(
                            queryOpts,
                        ),
                        endDate: input.end_date,
                        startDate: input.start_date,
                        sorters,
                    }),
                    displayGenerated,
                ),
            };
        }

        return {
            error: true,
            json: validator.errors(),
        };
    },
};
