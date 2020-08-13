const {isPlainObject} = require('lodash');
const Messages = require('../Messages');
const {Validator} = require('../validators');
const chalk = require('chalk');
const logger = require('../helpers/logger');

module.exports = class BaseController {
    updateValidationRules = {};
    createValidationRules = {};
    Service = undefined;
    Model = undefined;

    createRelations(opts) {
        return opts.model;
    }

    updateRelations(opts) {
        return opts.model;
    }

    sanitizeUpdateValues(record) {
        return record;
    }

    sanitizeCreateValues(record, req, res) {
        return record;
    }

    parseRecord(record) {
        return record;
    }

    async update(req, res) {
        const {data} = req.body;
        const rules = this.updateValidationRules;

        if (Array.isArray(data)) {
            const errors = [];
            const validRecords = [];

            for (const record of data) {
                if (isPlainObject(record)) {
                    const workingRecord = this.parseRecord(record);
                    const validator = new Validator(workingRecord, rules, {req});

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
                    let model = await this.Model.findOne({
                        where: {id: record.id},
                    });
                    let values = this.sanitizeUpdateValues(record, req, res);

                    if (values instanceof Promise) {
                        values = await values;
                    }

                    logger.log(
                        `Updating ${this.Model.name} #${record.id} with`,
                        chalk.green(JSON.stringify(values, null, 2)),
                    );

                    if (values.hasOwnProperty('created_at')) {
                        model.setDataValue('created_at', values.created_at);
                    }

                    await model.update(values);

                    if (this.updateRelations) {
                        model = await this.updateRelations({
                            record,
                            model,
                            req,
                        });
                    }

                    output.push(model.toJSON());
                }

                res.json(output);
            }
        } else {
            res.status(400).json(Messages.ERROR_INVALID_INPUT);
        }
    }

    async create(req, res) {
        const {data} = req.body;
        const rules = this.createValidationRules;

        if (Array.isArray(data)) {
            const errors = [];
            const validRecords = [];

            for (const record of data) {
                if (isPlainObject(record)) {
                    const workingRecord = this.parseRecord(record);
                    const validator = new Validator(workingRecord, rules, {req});

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
                    const values = this.sanitizeCreateValues(record, req, res);
                    let model;

                    logger.log(
                        `Updating ${this.Model.name} #${record.id} with`,
                        chalk.green(JSON.stringify(values, null, 2)),
                    );

                    try {
                        model = await this.Model.create(values);
                    } catch (e) {
                        if (e.original.code === 'ER_DUP_ENTRY') {
                            continue;
                        }
                    }

                    if (this.createRelations) {
                        model = await this.createRelations({
                            record,
                            model,
                            req,
                        });
                    }

                    output.push(model.toJSON());
                }

                res.json(output);
            }
        } else {
            res.status(400).json(Messages.ERROR_INVALID_INPUT);
        }
    }

    async destroyModel(model) {
        return model.destroy();
    }

    async destroy(req, res) {
        const {data} = req.body;

        if (Array.isArray(data)) {
            const output = [];

            for (const record of data) {
                if (isPlainObject(record)) {
                    const model = await this.Model.findOne({
                        where: {id: record.id, project_id: req.projectId},
                    });

                    if (model) {
                        output.push(model.toJSON());

                        await this.destroyModel(model);
                    } else {
                        output.push({
                            id: Messages.ERROR_INVALID_ID,
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
    }

    async list(req, res) {
        if (this.Service) {
            const {error, json} = await this.Service.list(req);

            if (error) {
                res.status(400);
            }

            res.json(json);
        } else {
            res.json(
                await this.Model.findAll({
                    where: {
                        project_id: req.projectId,
                    },
                }),
            );
        }
    }
};
