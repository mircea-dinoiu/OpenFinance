import moment from 'moment';
import {isPlainObject} from 'lodash';
import validatorLib from 'validator';
import chalk from 'chalk';
import logger from '../helpers/logger';
import {sumArray} from '../../src/app/numbers';
import {getExpenseModel} from '../models';
import {RepeatOption} from '../../src/transactions/RepeatOption';

const debug = process.env.DEBUG === 'true';
const PERC_MIN = 0;
const PERC_MAX = 100;

const getIsArray = (value) => Array.isArray(value);

const getIsInt = (value: number | string) => {
    if (typeof value === 'number') {
        return true;
    }

    return validatorLib.isInt(value);
};

const getIsFloat = (value: number | string) => {
    if (typeof value === 'number') {
        return true;
    }

    return validatorLib.isFloat(value);
};

const isTransactionIdArray = async (array: string[], opts) => {
    if (!getIsArray(array)) {
        return false;
    }

    const ids = Array.from(new Set(array));
    const idsAreInt = ids.every((id) => getIsInt(id));

    if (!idsAreInt) {
        return false;
    }

    return (
        ids.length ===
        (await getExpenseModel().count({
            where: {
                repeat_link_id: null,
                project_id: opts.req.projectId,
                id: ids,
            },
        }))
    );
};

const isId = async (id, Model) => {
    if (!getIsInt(id)) {
        return false;
    }

    return Boolean(await Model.find({where: {id}}));
};

const validator = {
    ...validatorLib,
    isInt: getIsInt,
    isFloat: getIsFloat,
    isArray: getIsArray,
    isDateFormat: (value, format) => moment(value, format).isValid(),
    isId,
    isTransactionId: async (id, opts) => {
        return isTransactionIdArray([id], opts);
    },
    isTransactionIdArray,
    isIdArray: async (array: string[], Model, opts) => {
        if (!getIsArray(array)) {
            return false;
        }

        const ids = Array.from(new Set(array));
        const idsAreInt = ids.every((id) => getIsInt(id));

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
        if (!isPlainObject(obj)) {
            return false;
        }

        const values: number[] = Object.values(obj);

        if (sumArray(values) !== PERC_MAX) {
            return false;
        }

        if (values.some((value) => value < PERC_MIN || value > PERC_MAX || !getIsInt(value as any))) {
            return false;
        }

        for (const id in obj) {
            if ((await isId(Number(id), Model)) !== true) {
                return false;
            }
        }

        return true;
    },
    isTableSorters: (data, Model, extra: any[] = []) => {
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
    isRepeatValue: (value) => Object.values(RepeatOption).includes(value),
    isStatusValue: (value) => ['finished', 'pending', 'draft'].includes(value),
    isAccountStatus: (value) => ['open', 'locked', 'closed'].includes(value),
    isAccountType: (value) => ['cash', 'checking', 'savings', 'credit', 'brokerage', 'loan'].includes(value),
    isNotZero: (value) => Number(value) !== 0,
    isPositive: (value) => Number(value) >= 0,
    isHigherThanZero: (value) => Number(value) > 0,
    isDueDay: (value) => Number(value) >= 1 && Number(value) <= 31,
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
};

class Validator {
    messages: any;
    rules: any;
    opts: any;
    data: any;

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
                let params: any[] = [];

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

export {Validator};
