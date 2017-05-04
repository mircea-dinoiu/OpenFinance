const BaseController = require('./BaseController');
const {Expense, sql} = require('../models');

module.exports = BaseController.extend({
    async getCategories(req, res) {
        const search = req.query.search;
        let ret = [];

        if ('string' === typeof search && search.length) {
            const response = await Expense.scope('default').findAll({
                where: sql.where(
                    sql.fn('lower', sql.col('item')),
                    search.toLowerCase().trim()
                ),
                order: [
                    [sql.col('created_at'), 'DESC']
                ]
            });

            for (const record of response) {
                const json = record.toJSON();

                if (json.categories.length) {
                    ret = json.categories;
                    break;
                }
            }
        }

        res.json(ret);
    }
});