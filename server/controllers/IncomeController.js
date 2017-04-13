const {Income} = require('../models');

module.exports = {
    async getList() {
        return Income.findAll();
    }
};