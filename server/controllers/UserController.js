const {User} = require('../models');

module.exports = class UserController {
    async list(req, res) {
        res.json({
            current: req.user,
            list: await User.findAll(),
        });
    }
};
