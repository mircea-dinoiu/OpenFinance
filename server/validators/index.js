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
});

class Validator {
    constructor(data, rules) {
        this.data = data;
        this.rules = rules;
        this.messages = {};
    }

    check() {
        Object.keys(this.rules).forEach(dataKey => {
            const value = this.data[dataKey];
            const rules = [...this.rules[dataKey]];
            let error = '';

            rules.every(rule => {
                let ruleName = rule;
                let params = [];

                if (Array.isArray(rule)) {
                    ruleName = rule.shift();
                    params = rule;
                }

                if (ruleName === 'sometimes') {
                    if (value === undefined) {
                        return false;
                    }
                }

                switch (ruleName) {
                    case 'sometimes':
                        if (value === undefined) {
                            return false;
                        }
                        break;
                    default:
                        const ruleFn = validator[ruleName];

                        if (!ruleFn) {
                            throw new Error(`Invalid validation rule specified: "${ruleName}"`);
                        }

                        if (debug) {
                            console.log(
                                `${dataKey}: validator.${ruleName}(${[value].concat(params).join(', ')})`
                            );
                        }

                        if (!ruleFn.call(validator, value, ...params)) {
                            error = 'Invalid input data';
                            return false;
                        }
                }

                return true;
            });

            if (error) {
                this.messages[dataKey] = [error];
            }
        });
    }

    passes() {
        this.check();

        return Object.keys(this.messages).length === 0;
    }

    errors() {
        return this.messages;
    }
}

module.exports = {
    Validator
};