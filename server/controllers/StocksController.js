const {Stock: Model} = require('../models');
const BaseController = require('./BaseController');

module.exports = class StocksController extends BaseController {
    constructor() {
        super();
        this.Model = Model;
    }

    async list(req, res) {
        res.json(
            await this.Model.findAll({
                order: [['symbol', 'ASC']],
            }),
        );
    }
};
