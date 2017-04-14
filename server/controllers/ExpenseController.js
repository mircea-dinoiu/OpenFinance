const {Expense} = require('../models');

module.exports = {
    async getList() {
        return Expense.scope('default').findAll();
    }
};