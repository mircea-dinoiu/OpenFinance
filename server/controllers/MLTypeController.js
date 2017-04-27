const {MLType: Model} = require('../models');
const BaseController = require('./BaseController');

module.exports = BaseController.extend({
    Model,

    updateValidationRules: {
        id: ['isRequired', ['isId', Model]],
        name: ['sometimes', 'isRequired', 'isString']
    },

    createValidationRules: {
        name: ['isRequired', 'isString']
    },

    sanitizeUpdateValues(record) {
        const values = {};

        if (record.hasOwnProperty('name')) {
            values.name = record.name.trim();
        }

        return values;
    },

    sanitizeCreateValues(record) {
        return {
            name: record.name.trim()
        };
    }
});