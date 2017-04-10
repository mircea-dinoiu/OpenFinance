const {Category, Expense} = require('../models');

module.exports = {
    async getList() {
        const categories = await Category.findAll({
            attributes: Object.keys(Category.rawAttributes).concat([
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

    async postDelete() {
        // todo
    },
};