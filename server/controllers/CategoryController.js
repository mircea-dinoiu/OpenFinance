const {Category: Model, Expense} = require('../models');
const BaseController = require('./BaseController');

module.exports = Object.assign({}, BaseController, {
    Model,

    async getList() {
        const categories = await Model.findAll({
            attributes: Object.keys(Model.rawAttributes).concat([
                ['COUNT(expenses.id)', 'expenseCount']
            ]),
            include: [{model: Expense, attributes: []}],
            group: ['id']
        });

        return categories.map((model) => {
            const json = model.toJSON();

            json.expenses = json.expenseCount;

            delete json.expenseCount;

            return json;
        });
    },

    async postUpdate() {
        // todo
    },

    async postCreate() {
        // todo
    },
});