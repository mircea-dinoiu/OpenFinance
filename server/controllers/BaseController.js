const {isPlainObject} = require('lodash');
const Messages = require('../Messages');
const {Validator} = require('../validators');
const chalk = require('chalk');

module.exports = {
    parseRecord(record) {
        return record;
    },

    async postUpdate(req, res) {
        const {data} = req.body;
        const rules = this.updateValidationRules;

        if (Array.isArray(data)) {
            const errors = [];
            const validRecords = [];

            for (const record of data) {
                if (isPlainObject(record)) {
                    const workingRecord = this.parseRecord(record);
                    const validator = new Validator(workingRecord, rules);

                    if (await validator.passes()) {
                        validRecords.push(workingRecord);
                    } else {
                        errors.push(validator.errors());
                    }
                } else {
                    errors.push(Messages.ERROR_INVALID_INPUT);
                }
            }

            if (errors.length) {
                res.status(400).json(errors);
            } else {
                const output = [];

                for (const record of validRecords) {
                    let model = await this.Model.findOne({where: {id: record.id}});
                    let values = this.sanitizeUpdateValues(record, model);

                    if (values instanceof Promise) {
                        values = await values;
                    }

                    console.log(
                        chalk.inverse(`Updating ${this.Model.name} #${record.id} with`),
                        chalk.green(JSON.stringify(values, null, 2))
                    );

                    if (values.hasOwnProperty('created_at')) {
                        model.setDataValue('created_at', values.created_at);
                    }

                    await model.update(values);

                    if (this.updateRelations) {
                        model = await this.updateRelations({record, model});
                    }

                    output.push(model.toJSON());
                }

                res.json(output);
            }
        } else {
            res.status(400).json(Messages.ERROR_INVALID_INPUT);
        }
    },

    async postCreate(req, res) {
        const {data} = req.body;
        const rules = this.createValidationRules;

        if (Array.isArray(data)) {
            const errors = [];
            const validRecords = [];

            for (const record of data) {
                if (isPlainObject(record)) {
                    const workingRecord = this.parseRecord(record);
                    const validator = new Validator(workingRecord, rules);

                    if (await validator.passes()) {
                        validRecords.push(workingRecord);
                    } else {
                        errors.push(validator.errors());
                    }
                } else {
                    errors.push(Messages.ERROR_INVALID_INPUT);
                }
            }

            if (errors.length) {
                res.status(400).json(errors);
            } else {
                const output = [];

                for (const record of validRecords) {
                    let values = this.sanitizeCreateValues(record);

                    if (values instanceof Promise) {
                        values = await values;
                    }

                    console.log(
                        chalk.inverse(`Updating ${this.Model.name} #${record.id} with`),
                        chalk.green(JSON.stringify(values, null, 2))
                    );

                    let model = await this.Model.create(values);

                    if (this.createRelations) {
                        model = await this.createRelations({
                            record,
                            model,
                            req
                        });
                    }

                    output.push(model.toJSON());
                }

                res.json(output);
            }
        } else {
            res.status(400).json(Messages.ERROR_INVALID_INPUT);
        }
    },

    async postDelete(req, res) {
        const {data} = req.body;

        if (Array.isArray(data)) {
            const output = [];

            for (const record of data) {
                if (isPlainObject(record)) {
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