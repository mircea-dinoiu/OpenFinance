import {isPlainObject} from 'lodash';
import Sequelize from 'sequelize';
import {Message as Messages} from '../Messages';
import {Validator} from '../validators';
import chalk from 'chalk';
import logger from '../helpers/logger';
import express from 'express';

type ServiceType = {
    list: (req: express.Request) => Promise<{error: unknown; json: unknown}>;
};

export class BaseController {
    updateValidationRules: Record<string, unknown[]>;
    createValidationRules: Record<string, unknown[]>;
    Service?: ServiceType;
    Model: Sequelize.Model<unknown, unknown>;

    constructor(M: Sequelize.Model<unknown, unknown>, S?: ServiceType) {
        this.updateValidationRules = {};
        this.createValidationRules = {};
        this.Model = M;
        this.Service = S;
    }

    createRelations(opts) {
        return opts.model;
    }

    updateRelations(opts) {
        return opts.model;
    }

    sanitizeUpdateValues(record, req, res) {
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
            const errors: string[] = [];
            const validRecords: {id: number}[] = [];

            for (const record of data) {
                if (isPlainObject(record)) {
                    const workingRecord = this.parseRecord(record);
                    const validator = new Validator(workingRecord, rules, {
                        req,
                    });

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
                for (const record of validRecords) {
                    const model = await this.Model.findOne({
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
                        await this.updateRelations({
                            record,
                            model,
                            req,
                        });
                    }
                }

                res.sendStatus(200);
            }
        } else {
            res.status(400).json(Messages.ERROR_INVALID_INPUT);
        }
    }

    async create(req, res) {
        const {data} = req.body;
        const rules = this.createValidationRules;

        if (Array.isArray(data)) {
            const errors: string[] = [];
            const validRecords: {id: number}[] = [];

            for (const record of data) {
                if (isPlainObject(record)) {
                    const workingRecord = this.parseRecord(record);
                    const validator = new Validator(workingRecord, rules, {
                        req,
                    });

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
                        await this.createRelations({
                            record,
                            model,
                            req,
                        });
                    }
                }

                res.sendStatus(200);
            }
        } else {
            res.status(400).json(Messages.ERROR_INVALID_INPUT);
        }
    }

    async destroy(req, res) {
        const {ids} = req.body;

        await this.Model.destroy({
            where: {
                id: ids,
            },
        });

        return res.sendStatus(200);
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
}
