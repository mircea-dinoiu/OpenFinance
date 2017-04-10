const {User} = require('../models');

module.exports = {
    async getList() {
        return {
            current: null, // todo,
            list: await User.findAll()
        };
    }
};