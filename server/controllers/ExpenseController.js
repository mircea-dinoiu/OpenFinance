const {Expense: Model, User, Currency, MoneyLocation, Category} = require('../models');
const BaseController = require('./BaseController');
const Service = require('../services/ExpenseService');

module.exports = BaseController.extend({
    Model,
    Service,

    async postCreate(req, res) {
        const {data} = req.body;
        const validRecords = [];
        const errors = [];

        if (Array.isArray(data)) {
            const rules = {
                'sum': ['isRequired', 'isFloat', 'isNotZero'],
                'item': ['isRequired', 'isString'],
                'repeat': ['sometimes', 'isRepeatValue'],
                'users': ['isRequired', ['isIdArray', User]],
                'created_at': ['sometimes', 'isRequired', 'isInt'],
                'currency_id': ['sometimes', 'isRequired', ['isId', Currency]],
                'money_location_id': ['sometimes', ['isId', MoneyLocation]],
                'categories': ['sometimes', ['isIdArray', Category]]
            };
        }
    }
});