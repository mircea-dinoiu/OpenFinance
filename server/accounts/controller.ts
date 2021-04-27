import {getAccountModel, getCurrencyModel} from '../models';
import {CrudController} from '../CrudController';
import {pick} from 'lodash';

export class AccountController extends CrudController {
    constructor() {
        super(getAccountModel());
    }
    updateValidationRules = {
        id: ['isRequired', ['isId', getAccountModel()]],
        name: ['sometimes', 'isRequired', 'isString'],
        status: ['sometimes', 'isRequired', 'isAccountStatus'],
        type: ['sometimes', 'isRequired', 'isAccountType'],
        currency_id: ['sometimes', 'isRequired', ['isId', getCurrencyModel()]],
        credit_limit: ['sometimes', 'isRequired', 'isInt', 'isHigherThanZero'],
        credit_apr: ['sometimes', 'isRequired', 'isFloat', 'isPositive'],
        credit_minpay: ['sometimes', 'isRequired', 'isFloat', 'isHigherThanZero'],
        credit_dueday: ['sometimes', 'isRequired', 'isDueDay'],
    };
    createValidationRules = {
        name: ['isRequired', 'isString'],
        status: ['isRequired', 'isAccountStatus'],
        type: ['isRequired', 'isAccountType'],
        currency: ['isRequired', ['isId', getCurrencyModel()]],
        credit_limit: ['sometimes', 'isRequired', 'isInt', 'isHigherThanZero'],
        credit_apr: ['sometimes', 'isRequired', 'isFloat', 'isPositive'],
        credit_minpay: ['sometimes', 'isRequired', 'isFloat', 'isHigherThanZero'],
        credit_dueday: ['sometimes', 'isRequired', 'isDueDay'],
    };

    sanitizeUpdateValues(record) {
        const values: any = pick(
            record,
            'status',
            'type',
            'currency_id',
            'credit_limit',
            'credit_apr',
            'credit_minpay',
            'credit_dueday',
        );

        if (record.hasOwnProperty('name')) {
            values.name = record.name.trim();
        }

        return values;
    }

    sanitizeCreateValues(record) {
        return {
            ...pick(
                record,
                'status',
                'type',
                'currency_id',
                'credit_limit',
                'credit_apr',
                'credit_minpay',
                'credit_dueday',
            ),
            name: record.name.trim(),
        };
    }
}
