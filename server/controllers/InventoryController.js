const {Inventory: Model} = require('../models');
const BaseController = require('./BaseController');

module.exports = class InventoryController extends BaseController {
    Model = Model;
};
