const {MoneyLocation} = require('../models');

module.exports = {
    async getList() {
        return MoneyLocation.findAll();
    }
};