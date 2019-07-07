const {User} = require('../models');

module.exports = {
    async getList(req, res) {
        res.json({
            current: req.user,
            list: await User.findAll(),
        });
    },
};
