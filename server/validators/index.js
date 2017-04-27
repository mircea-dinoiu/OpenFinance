const moment = require('moment');
const {isPlainObject} = require('lodash');
const validator = require('validator');
const debug = require('config').get('debug');

Object.assign(validator, {
    isArray: (value) => {
        return Array.isArray(value);
    },
    isPlainObject: (value) => {
        return isPlainObject(value);
    },
    isDateFormat: (value, format) => {
        return moment(value, format).isValid();
    },
    isId: async (id, Model) => {
        if (!validator.isInt(String(id))) {
            return false;
        }

        return Boolean(await Model.find({where: {id}}));
    },
    isIdArray: async (array, Model) => {
        if (!validator.isArray(array)) {
            return false;
        }

        if (array.length !== new Set(array).size) {
            return false;
        }

        for (const id of array) {
            if (await validator.isId(id, Model) !== true) {
                return false;
            }
        }

        return true;
    },
    isRepeatValue: (value) => {
        return ['d', 'w', 'm', 'y'].includes(value);
    },
    isStatusValue: (value) => {
        return ['finished', 'pending'].includes(value);
    },
    isNotZero: (value) => {
        return Number(value) !== 0;
    },
    isString: (value) => {
        return typeof value === 'string';
    },
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
    }
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
                    ruleName = rule.shift();
                    params = rule;
                }

                if (ruleName === 'sometimes') {
                    if (value == null) {
                        break;
                    }
                } else {
                    const ruleFn = validator[ruleName];

                    if (!ruleFn) {
                        throw new Error(`Invalid validation rule specified: "${ruleName}"`);
                    }

                    if (debug) {
                        console.log(
                            `[DEBUG] ${dataKey}: validator.${ruleName}(${[value].concat(params).join(', ')})`
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
    Validator
};