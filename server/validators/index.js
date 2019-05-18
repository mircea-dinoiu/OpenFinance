const moment = require('moment');
const { isPlainObject } = require('lodash');
const validator = require('validator');
const debug = require('config').get('debug');
const chalk = require('chalk');
const stringIsInt = validator.isInt;
const stringIsFloat = validator.isFloat;
const logger = require('../helpers/logger');

Object.assign(validator, {
    isInt: (value) => {
        if (typeof value === 'number') {
            return true;
        }

        return stringIsInt(value);
    },
    isFloat: (value) => {
        if (typeof value === 'number') {
            return true;
        }

        return stringIsFloat(value);
    },
    isArray: (value) => Array.isArray(value),
    isPlainObject: (value) => isPlainObject(value),
    isDateFormat: (value, format) => moment(value, format).isValid(),
    isId: async (id, Model) => {
        if (!validator.isInt(id)) {
            return false;
        }

        return Boolean(await Model.find({ where: { id } }));
    },
    isIdArray: async (array, Model) => {
        if (!validator.isArray(array)) {
            return false;
        }

        if (array.length !== new Set(array).size) {
            return false;
        }

        for (const id of array) {
            if ((await validator.isId(id, Model)) !== true) {
                return false;
            }
        }

        return true;
    },
    isTableSorters: (data, Model, extra = []) => {
        try {
            const json = JSON.parse(data);

            if (Array.isArray(json)) {
                for (const pair of json) {
                    if (!Model.attributes.hasOwnProperty(pair.id) && !extra.includes(pair.id)) {
                        return false;
                    }
                }

                return true;
            }
        } catch (e) {
            logger.error(e);
        }

        return false;
    },
    isTableFilters: (data, validAttrs) => {
        try {
            const json = JSON.parse(data);

            if (Array.isArray(json)) {
                for (const pair of json) {
                    if (pair.value === undefined) {
                        return false;
                    }

                    if (!validAttrs.includes(pair.id)) {
                        return false;
                    }
                }

                return true;
            }
        } catch (e) {
            logger.error(e);
        }

        return false;
    },
    isRepeatValue: (value) =>
        ['d', 'w', '2w', 'm', '2m', '3m', 'y'].includes(value),
    isStatusValue: (value) => ['finished', 'pending'].includes(value),
    isTypeValue: (value) => ['withdrawal', 'deposit'].includes(value),
    isNotZero: (value) => Number(value) !== 0,
    isNotNegative: (value) => Number(value) >= 0,
    isString: (value) => typeof value === 'string',
    isBool: (value) => typeof value === 'boolean',
    isRequired: (value) => {
        if (value == null) {
            return false;
        }

        if (Array.isArray(value) || typeof value === 'string') {
            return value.length > 0;
        }

        if (isPlainObject(value)) {
            return Object.keys(value).length > 0;
        }

        return true;
    },
});

class Validator {
    constructor(data, rules) {
        this.data = data;
        this.rules = rules;
        this.messages = {};
    }

    async check() {
        for (const dataKey of Object.keys(this.rules)) {
            const value = this.data[dataKey];
            const rules = [...this.rules[dataKey]];
            let error = '';

            for (const rule of rules) {
                let ruleName = rule;
                let params = [];

                if (Array.isArray(rule)) {
                    const copy = Array.from(rule);

                    ruleName = copy.shift();
                    params = copy;
                }

                if (ruleName === 'sometimes') {
                    if (value == null) {
                        break;
                    }
                } else {
                    const ruleFn = validator[ruleName];

                    if (!ruleFn) {
                        throw new Error(
                            `Invalid validation rule specified: "${ruleName}"`,
                        );
                    }

                    if (debug) {
                        logger.log(
                            'Validation rule called',
                            chalk.green(
                                `${dataKey}: validator.${ruleName}(${[value]
                                    .concat(params)
                                    .join(', ')})`,
                            ),
                        );
                    }

                    let result = false;

                    try {
                        result = ruleFn.call(validator, value, ...params);
                    } catch (e) {
                        console.trace(e);
                    }

                    if (typeof result !== 'boolean') {
                        result = await result;
                    }

                    if (result === false) {
                        error = 'Invalid input data';
                        break;
                    }
                }
            }

            if (error) {
                this.messages[dataKey] = [error];
            }
        }
    }

    async passes() {
        await this.check();

        return Object.keys(this.messages).length === 0;
    }

    errors() {
        return this.messages;
    }
}

module.exports = {
    Validator,
};
