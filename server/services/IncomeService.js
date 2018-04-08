const {pick} = require('lodash');
const {Validator} = require('../validators');
const {Income: Model} = require('../models');
const RepeatedModelsHelper = require('../helpers/RepeatedModelsHelper');

module.exports = {
    async list(query) {
        const input = pick(query, 'start_date', 'end_date', 'page', 'limit');
        const rules = {
            start_date: ['sometimes', ['isDateFormat', 'YYYY-MM-DD']],
            end_date: ['isRequired', ['isDateFormat', 'YYYY-MM-DD']],
            page: ['sometimes', 'isInt'],
            limit: ['sometimes', 'isInt']
        };
        const validator = new Validator(input, rules);

        if (await validator.passes()) {
            const whereClause = [];
            const whereReplacements = [];

            if (input.start_date) {
                whereClause.push(`DATE(${Model.tableName}.created_at) >= ?`);
                whereReplacements.push(input.start_date);
            }

            whereClause.push(`DATE(${Model.tableName}.created_at) <= ?`);
            whereReplacements.push(input.end_date);

            const queryOpts = {
                where: [whereClause.join(' AND '), ...whereReplacements]
            };

            if (input.page != null && input.limit != null) {
                const offset = (input.page - 1) * input.limit;

                Object.assign(queryOpts, {
                    // https://github.com/sequelize/sequelize/issues/3007
                    order: `created_at DESC LIMIT ${offset}, ${input.limit}`
                });
            }

            return {
                error: false,
                json: RepeatedModelsHelper.generateClones({
                    records: await Model.findAll(queryOpts),
                    endDate: input.end_date
                })
            };
        }
            
return {
                error: true,
                json: validator.errors()
            };
    }
};