const {MoneyLocation: Model, MLType, Currency} = require('../models');
const BaseController = require('./BaseController');
const {pick} = require('lodash');

module.exports = class MoneyLocationController extends BaseController {
    Model = Model;
    updateValidationRules = {
        id: ['isRequired', ['isId', Model]],
        name: ['sometimes', 'isRequired', 'isString'],
        status: ['sometimes', 'isRequired', 'isAccountStatus'],
        type_id: ['sometimes', 'isRequired', ['isId', MLType]],
        currency_id: ['sometimes', 'isRequired', ['isId', Currency]],
    };
    createValidationRules = {
        name: ['isRequired', 'isString'],
        status: ['isRequired', 'isAccountStatus'],
        type_id: ['isRequired', ['isId', MLType]],
        currency: ['isRequired', ['isId', Currency]],
    };

    sanitizeUpdateValues(record) {
        const values = pick(record, 'status', 'type_id', 'currency_id');

        if (record.hasOwnProperty('name')) {
            values.name = record.name.trim();
        }

        return values;
    }

    sanitizeCreateValues(record) {
        return {
            ...pick(record, 'status', 'type_id', 'currency_id'),
            name: record.name.trim(),
        };
    }
};
