const { pick } = require('lodash');
const { Validator } = require('../validators');
const { Expense: Model } = require('../models');
const RepeatedModelsHelper = require('../helpers/RepeatedModelsHelper');
const {
    mapInputToSorters,
    mapSortersToSQL,
    mapInputToLimitSQL,
} = require('../helpers');

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
            start_date: ['sometimes', ['isDateFormat', 'YYYY-MM-DD']],
            end_date: ['isRequired', ['isDateFormat', 'YYYY-MM-DD']],
            filters: ['sometimes', 'isPlainObject'],
            page: ['sometimes', 'isInt'],
            limit: ['sometimes', 'isInt'],
            sorters: ['sometimes', ['isTableSorters', Model]],
        };
        const validator = new Validator(input, rules);

        if (await validator.passes()) {
            const whereClause = [];
            const whereReplacements = [];

            if (input.start_date) {
                whereClause.push(
                    `(DATE(${Model.tableName}.created_at) >= ? OR ${
                        Model.tableName
                    }.repeat IS NOT null)`,
                );
                whereReplacements.push(input.start_date);
            }

            whereClause.push(`DATE(${Model.tableName}.created_at) <= ?`);
            whereReplacements.push(input.end_date);

            if (input.filters) {
                Object.keys(input.filters).forEach((key) => {
                    const value = input.filters[key];

                    if (['status'].includes(key)) {
                        whereClause.push(`${key} = ?`);
                        whereReplacements.push(value);
                    }
                });
            }

            const queryOpts = {
                where: [whereClause.join(' AND '), ...whereReplacements],
            };

            const sorters = mapInputToSorters(input);

            queryOpts.order =
                mapSortersToSQL(sorters) + mapInputToLimitSQL(input);

            return {
                error: false,
                json: RepeatedModelsHelper.generateClones({
                    records: await Model.scope('default').findAll(queryOpts),
                    endDate: input.end_date,
                    startDate: input.start_date,
                    sorters,
                }),
            };
        }

        return {
            error: true,
            json: validator.errors(),
        };
    },
};
