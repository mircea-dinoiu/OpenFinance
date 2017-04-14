const {Income: Model} = require('../models');
const BaseController = require('./BaseController');

module.exports = Object.assign({}, BaseController, {
    Model,

    async getList(req, res) {
        const {
            start_date,
            end_date,
            page,
            per_page
        } = req.query;

        start_date !== undefined && req.checkQuery('start_date').isDateFormat('YYYY-MM-DD');
        end_date !== undefined && req.checkQuery('end_date').isDateFormat('YYYY-MM-DD');
        page !== undefined && req.checkQuery('page').isInt();
        per_page !== undefined && req.checkQuery('per_page').isInt();

        const result = await req.getValidationResult();

        if (!result.isEmpty()) {
            res.status(400);

            return result.array();
        }

        const whereClause = [];
        const whereReplacements = [];

        if (start_date) {
            whereClause.push(`DATE(${Model.tableName}.created_at) >= ?`);
            whereReplacements.push(start_date);
        }

        if (end_date) {
            whereClause.push(`DATE(${Model.tableName}.created_at) <= ?`);
            whereReplacements.push(end_date);
        }

        const queryOpts = {
            where: [whereClause.join(' AND '), ...whereReplacements]
        };

        if (page != null && per_page != null) {
            const offset = (page - 1) * per_page;

            Object.assign(queryOpts, {
                // https://github.com/sequelize/sequelize/issues/3007
                order: `created_at DESC LIMIT ${offset}, ${per_page}`
            });
        }

        return Model.findAll(queryOpts);
    }
});