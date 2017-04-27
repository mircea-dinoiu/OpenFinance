const {Income: Model} = require('../models');
const BaseController = require('./BaseController');
const Service = require('../services/IncomeService');

module.exports = BaseController.extend({
    Model,
    Service
});