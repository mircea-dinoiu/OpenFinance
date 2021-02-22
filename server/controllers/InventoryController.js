const {Inventory: Model} = require('../models');
const BaseController = require('./BaseController');

module.exports = class MoneyLocationController extends BaseController {
    Model = Model;
};
