const {Income: Model} = require('../models');
const BaseController = require('./BaseController');
const Service = require('../services/IncomeService');

module.exports = Object.assign({}, BaseController, {
    Model,
    Service
});