const {MLType} = require('../models');

module.exports = {
    async getList() {
        return MLType.findAll();
    }
};