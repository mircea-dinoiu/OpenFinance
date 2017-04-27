const {Category: Model, Expense} = require('../models');
const BaseController = require('./BaseController');
const {Validator} = require('../validators');
const {isPlainObject} = require('lodash');
const Messages = require('../Messages');

module.exports = Object.assign({}, BaseController, {
    Model,

    async getList(req, res) {
        const categories = await Model.findAll({
            attributes: Object.keys(Model.rawAttributes).concat([
                ['COUNT(expenses.id)', 'expenseCount']
            ]),
            include: [{model: Expense, attributes: []}],
            group: ['id']
        });

        res.json(categories.map((model) => {
            const json = model.toJSON();

            json.expenses = json.expenseCount;

            delete json.expenseCount;

            return json;
        }));
    },

    async postUpdate(req, res) {
        const {data} = req.body;
        const rules = {
            id: ['isRequired', ['isId', Model]],
            name: ['sometimes', 'isRequired', 'isString']
        };

        if (Array.isArray(data)) {
            const output = [];

            for (const record of data) {
                if (isPlainObject(record)) {
                    const validator = new Validator(record, rules);

                    if (await validator.passes()) {
                        const model = await this.Model.findOne({where: {id: record.id}});
                        const values = {};

                        if (record.hasOwnProperty('name')) {
                            values.name = record.name.trim();
                        }

                        await model.update(values);

                        output.push(model.toJSON());
                    } else {
                        output.push(validator.errors());
                    }
                } else {
                    output.push(Messages.ERROR_INVALID_INPUT);
                }
            }

            res.json(output);
        } else {
            res.status(400).json(Messages.ERROR_INVALID_INPUT);
        }
    },

    async postCreate(req, res) {
        const {data} = req.body;
        const rules = {
            name: ['isRequired', 'isString']
        };

        if (Array.isArray(data)) {
            const output = [];

            for (const record of data) {
                if (isPlainObject(record)) {
                    const validator = new Validator(record, rules);

                    if (await validator.passes()) {
                        const values = {
                            name: record.name.trim()
                        };
                        const model = await this.Model.create(values);

                        output.push(model.toJSON());
                    } else {
                        output.push(validator.errors());
                    }
                } else {
                    output.push(Messages.ERROR_INVALID_INPUT);
                }
            }

            res.json(output);
        } else {
            res.status(400).json(Messages.ERROR_INVALID_INPUT);
        }
    },
});