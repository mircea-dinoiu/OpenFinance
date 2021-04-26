import {getExpenseModel, getCategoryModel} from '../models';
import {BaseController} from './BaseController';

export class CategoryController extends BaseController {
    constructor() {
        super(getCategoryModel());
        this.updateValidationRules = {
            id: ['isRequired', ['isId', getCategoryModel()]],
            name: ['sometimes', 'isRequired', 'isString'],
            color: ['sometimes', 'isString'],
        };
        this.createValidationRules = {
            name: ['isRequired', 'isString'],
        };
    }

    sanitizeUpdateValues(record) {
        const values: any = {};

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
        const categories = await getCategoryModel().findAll({
            attributes: Object.keys(getCategoryModel().rawAttributes).concat([
                ['COUNT(expenses.id)', 'expenseCount'],
            ] as any),
            include: [{model: getExpenseModel(), attributes: []}],
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
}
