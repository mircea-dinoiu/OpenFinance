const moment = require('moment');
const {isPlainObject} = require('lodash');
const validator = require('validator');
const debug = process.env.DEBUG === 'true';
const chalk = require('chalk');
const stringIsInt = validator.isInt;
const stringIsFloat = validator.isFloat;
const logger = require('../helpers/logger');
const defs = require('../../src/js/defs');
const {sumArray} = require('../../src/js/utils/numbers');
const {Expense} = require('../models');

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

        return Boolean(await Model.find({where: {id}}));
    },
    isTransactionId: async (id, opts) => {
        return validator.isTransactionIdArray([id], opts);
    },
    isTransactionIdArray: async (array, opts) => {
        if (!validator.isArray(array)) {
            return false;
        }

        const ids = Array.from(new Set(array));
        const idsAreInt = ids.every((id) => validator.isInt(id));

        if (!idsAreInt) {
            return false;
        }

        return (
            ids.length ===
            (await Expense.count({
                where: {
                    repeat_link_id: null,
                    project_id: opts.req.projectId,
                    id: ids,
                },
            }))
        );
    },
    isIdArray: async (array, Model, opts) => {
        if (!validator.isArray(array)) {
            return false;
        }

        const ids = Array.from(new Set(array));
        const idsAreInt = ids.every((id) => validator.isInt(id));

        if (!idsAreInt) {
            return false;
        }

        return (
            ids.length ===
            (await Model.count({
                where: {project_id: opts.req.projectId, id: ids},
            }))
        );
    },
    isPercentageObject: async (obj, Model) => {
        if (!validator.isPlainObject(obj)) {
            return false;
        }

        const values = Object.values(obj);

        if (sumArray(values) !== defs.PERC_MAX) {
            return false;
        }

        if (values.some((value) => value < defs.PERC_MIN || value > defs.PERC_MAX || !validator.isInt(value))) {
            return false;
        }

        for (const id in obj) {
            if ((await validator.isId(Number(id), Model)) !== true) {
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
    isRepeatValue: (value) => Object.values(defs.RepeatOption).includes(value),
    isStatusValue: (value) => ['finished', 'pending', 'draft'].includes(value),
    isAccountStatus: (value) => ['open', 'locked', 'closed'].includes(value),
    isAccountType: (value) => ['cash', 'credit', 'brokerage'].includes(value),
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
    constructor(data, rules, opts) {
        this.data = data;
        this.rules = rules;
        this.opts = opts;
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
                        throw new Error(`Invalid validation rule specified: "${ruleName}"`);
                    }

                    let result = false;

                    try {
                        result = ruleFn.call(validator, value, ...params, this.opts);
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

                    if (debug) {
                        logger.log(
                            result ? 'Validation rule passed' : 'Validation rule failed',
                            chalk[result ? 'green' : 'red'](
                                `${dataKey}: validator.${ruleName}(${[value].concat(params).join(', ')})`,
                            ),
                        );
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
