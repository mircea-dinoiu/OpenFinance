const {Expense} = require('../models');

module.exports = {
    async getList() {
        return Expense.findAll();
    }
};