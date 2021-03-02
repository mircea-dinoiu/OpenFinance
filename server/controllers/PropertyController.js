const {Property: Model} = require('../models');
const BaseController = require('./BaseController');

module.exports = class PropertyController extends BaseController {
    Model = Model;
};
