const {Income: Model, User, Currency, MoneyLocation} = require('../models');
const BaseController = require('./BaseController');
const CurrencyController = require('./CurrencyController');
const Service = require('../services/IncomeService');
const {pickOwnProperties, standardDate} = require('../helpers');

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
        created_at: ['sometimes', 'isRequired', 'isInt'],
        currency_id: ['sometimes', 'isRequired', ['isId', Currency]],
    },

    createValidationRules: {
        sum: ['isRequired', 'isFloat', 'isNotZero'],
        description: ['isRequired', 'isString'],
        user_id: ['isRequired', ['isId', User]],
        repeat: ['sometimes', 'isRepeatValue'],
        money_location_id: ['sometimes', ['isId', MoneyLocation]],
        created_at: ['sometimes', 'isRequired', 'isInt'],
        currency_id: ['sometimes', 'isRequired', ['isId', Currency]],
    },

    sanitizeUpdateValues(record) {
        const values = pickOwnProperties(
            record,
            [
                'sum',
                'description',
                'user_id',
                'money_location_id',
            ]
        );

        if (record.hasOwnProperty('repeat')) {
            values.repeat = record.repeat;

            if (values.repeat != null) {
                values.status = 'pending';
            }
        }

        if (record.hasOwnProperty('created_at')) {
            values.created_at = standardDate(record.created_at, 'X');
        }

        if (record.hasOwnProperty('currency_id')) {
            values.currency_id = record.currency_id;
        }

        if (record.hasOwnProperty('status') && !values.hasOwnProperty('repeat')) {
            values.status = record.status;

            if (values.status === 'finished') {
                values.repeat = null;
            }
        }

        return values;
    },

    async sanitizeCreateValues(record) {
        const values = pickOwnProperties(record, [
            'sum',
            'description',
            'user_id',
            'repeat',
            'money_location_id',
        ]);

        values.status = 'pending';

        if (record.hasOwnProperty('currency_id')) {
            values.currency_id = record.currency_id;
        } else {
            const defaultCurrency = await CurrencyController.getDefaultCurrency();

            values.currency_id = defaultCurrency.id;
        }

        if (record.hasOwnProperty('created_at')) {
            values.created_at = standardDate(record.created_at, 'X');
        }

        return values;
    },

    parseRecord(record) {
        const workingRecord = Object.assign({}, record);

        if (workingRecord.hasOwnProperty('money_location_id') && workingRecord.money_location_id == 0) {
            workingRecord.money_location_id = null;
        }

        return workingRecord;
    },
});