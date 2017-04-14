const {User} = require('../models');

module.exports = {
    async getList(user) {
        return {
            current: user,
            list: await User.findAll()
        };
    }
};