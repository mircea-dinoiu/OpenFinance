const {Category: Model, Expense} = require('../models');
const BaseController = require('./BaseController');

module.exports = class CategoryController extends BaseController {
    constructor() {
        super();
        this.Model = Model;
        this.updateValidationRules = {
            id: ['isRequired', ['isId', Model]],
            name: ['sometimes', 'isRequired', 'isString'],
            color: ['sometimes', 'isString'],
        };
        this.createValidationRules = {
            name: ['isRequired', 'isString'],
        };
    }

    sanitizeUpdateValues(record) {
        const values = {};

        if (record.hasOwnProperty('name')) {
            values.name = record.name.trim();
        }

        if (record.hasOwnProperty('color')) {
            values.color = record.color.trim();
        }

        return values;
    }

    sanitizeCreateValues(record) {
        return {
            name: record.name.trim(),
        };
    }

    async list(req, res) {
        const categories = await Model.findAll({
            attributes: Object.keys(Model.rawAttributes).concat([['COUNT(expenses.id)', 'expenseCount']]),
            include: [{model: Expense, attributes: []}],
            group: ['id'],
            where: {
                project_id: req.projectId,
            },
        });

        res.json(
            categories.map((model) => {
                const json = model.toJSON();

                json.expenses = json.expenseCount;

                delete json.expenseCount;

                return json;
            }),
        );
    }
};
