const { Income: Model, User, MoneyLocation } = require('../models');
const BaseController = require('./BaseController');
const Service = require('../services/IncomeService');
const { pickOwnProperties } = require('../helpers');
const defs = require('../../shared/defs');

module.exports = BaseController.extend({
    Model,
    Service,

    updateValidationRules: {
        id: ['isRequired', ['isId', Model]],
        sum: ['sometimes', 'isRequired', 'isFloat', 'isNotZero'],
        description: ['sometimes', 'isRequired', 'isString'],
        repeat: ['sometimes', 'isRepeatValue'],
        user_id: ['sometimes', 'isRequired', ['isId', User]],
        money_location_id: ['sometimes', ['isId', MoneyLocation]],
        status: ['sometimes', 'isRequired', 'isStatusValue'],
        created_at: ['sometimes', 'isRequired', ['isDateFormat', defs.FULL_DATE_FORMAT_TZ]],
    },

    createValidationRules: {
        sum: ['isRequired', 'isFloat', 'isNotZero'],
        description: ['isRequired', 'isString'],
        user_id: ['isRequired', ['isId', User]],
        repeat: ['sometimes', 'isRepeatValue'],
        money_location_id: ['isRequired', ['isId', MoneyLocation]],
        created_at: ['sometimes', 'isRequired', ['isDateFormat', defs.FULL_DATE_FORMAT_TZ]],
    },

    sanitizeUpdateValues(record) {
        const values = pickOwnProperties(record, [
            'sum',
            'description',
            'user_id',
            'money_location_id',
        ]);

        if (record.hasOwnProperty('repeat')) {
            values.repeat = record.repeat;

            if (values.repeat != null) {
                values.status = 'pending';
            }
        }

        if (record.hasOwnProperty('created_at')) {
            values.created_at = record.created_at;
        }

        if (
            record.hasOwnProperty('status') &&
            !values.hasOwnProperty('repeat')
        ) {
            values.status = record.status;

            if (values.status === 'finished') {
                values.repeat = null;
            }
        }

        return values;
    },

    sanitizeCreateValues(record) {
        const values = pickOwnProperties(record, [
            'sum',
            'description',
            'user_id',
            'repeat',
            'money_location_id',
        ]);

        values.status = 'pending';

        if (record.hasOwnProperty('created_at')) {
            values.created_at = record.created_at;
        }

        return values;
    },
});
