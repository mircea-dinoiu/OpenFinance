const {Income: Model} = require('../models');
const BaseController = require('./BaseController');
const {pick} = require('lodash');
const {Validator} = require('../validators');

module.exports = Object.assign({}, BaseController, {
    Model,

    async getList(req, res) {
        const input = pick(req.query, 'start_date', 'end_date', 'page', 'per_page');
        const rules = {
            start_date: ['sometimes', ['isDateFormat', 'YYYY-MM-DD']],
            endt_date: ['sometimes', ['isDateFormat', 'YYYY-MM-DD']],
            page: ['sometimes', 'isInt'],
            per_page: ['sometimes', 'isInt']
        };
        const validator = new Validator(input, rules);

        if (validator.passes()) {
            const whereClause = [];
            const whereReplacements = [];

            if (input.start_date) {
                whereClause.push(`DATE(${Model.tableName}.created_at) >= ?`);
                whereReplacements.push(input.start_date);
            }

            if (input.end_date) {
                whereClause.push(`DATE(${Model.tableName}.created_at) <= ?`);
                whereReplacements.push(input.end_date);
            }

            const queryOpts = {
                where: [whereClause.join(' AND '), ...whereReplacements]
            };

            if (input.page != null && input.per_page != null) {
                const offset = (input.page - 1) * input.per_page;

                Object.assign(queryOpts, {
                    // https://github.com/sequelize/sequelize/issues/3007
                    order: `created_at DESC LIMIT ${offset}, ${input.per_page}`
                });
            }

            return Model.findAll(queryOpts);
        } else {
            res.status(400);

            return validator.errors();
        }
    }
});