const {User} = require('../models');

module.exports = {
    async getList(id) {
        return {
            current: await User.findOne({id}),
            list: await User.findAll()
        };
    }
};