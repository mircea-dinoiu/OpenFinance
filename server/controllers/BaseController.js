const {isPlainObject} = require('lodash');
const Messages = require('../Messages');
const {Validator} = require('../validators');

module.exports = {
    async postUpdate(req, res) {
        const {data} = req.body;
        const rules = this.updateValidationRules;

        if (Array.isArray(data)) {
            const output = [];

            for (const record of data) {
                if (isPlainObject(record)) {
                    const validator = new Validator(record, rules);

                    if (await validator.passes()) {
                        const model = await this.Model.findOne({where: {id: record.id}});

                        await model.update(this.sanitizeUpdateValues(record));

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
        const rules = this.createValidationRules;

        if (Array.isArray(data)) {
            const output = [];

            for (const record of data) {
                if (isPlainObject(record)) {
                    const validator = new Validator(record, rules);

                    if (await validator.passes()) {
                        const model = await this.Model.create(this.sanitizeCreateValues(record));

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

    async postDelete(req, res) {
        const {data} = req.body;

        if (Array.isArray(data)) {
            const output = [];

            for (const record of data) {
                if (isPlainObject(record) ) {
                    const model = await this.Model.findOne({where: {id: record.id}});

                    if (model) {
                        output.push(model.toJSON());

                        await model.destroy();
                    } else {
                        output.push({
                            id: Messages.ERROR_INVALID_ID
                        });
                    }
                } else {
                    output.push(Messages.ERROR_INVALID_RECORD);
                }
            }

            res.json(output);
        } else {
            res.status(400).json(Messages.ERROR_INVALID_INPUT);
        }
    },

    async getList(req, res) {
        if (this.Service) {
            const {error, json} = await this.Service.list(req.query);

            if (error) {
                res.status(400);
            }

            res.json(json);
        } else {
            res.json(await this.Model.findAll());
        }
    },

    extend(overrides) {
        return Object.assign({}, this, overrides);
    }
};