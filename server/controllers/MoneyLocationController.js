const {MoneyLocation: Model, MLType} = require('../models');
const BaseController = require('./BaseController');

module.exports = BaseController.extend({
    Model,

    updateValidationRules: {
        id: ['isRequired', ['isId', Model]],
        name: ['sometimes', 'isRequired', 'isString'],
        type_id: ['sometimes', 'isRequired', ['isId', MLType]],
    },

    createValidationRules: {
        name: ['isRequired', 'isString'],
        type_id: ['isRequired', ['isId', MLType]],
    },

    sanitizeUpdateValues(record) {
        const values = {};

        if (record.hasOwnProperty('name')) {
            values.name = record.name.trim();
        }

        if (record.hasOwnProperty('type_id')) {
            values.type_id = record.type_id;
        }

        return values;
    },

    sanitizeCreateValues(record) {
        return {
            name: record.name.trim(),
            type_id: record.type_id,
        };
    },
});
