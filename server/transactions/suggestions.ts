import Sequelize, {QueryTypes} from 'sequelize';
import {getDb} from '../getDb';
import {getExpenseModel} from '../models';
import {mapSearchKeywordToWheres, mapSearchKeywordToLiteralWheres} from '../helpers/mapSearchKeywordToWheres';
import {mapSearchToWords} from '../helpers/mapSearchToWords';

export const getExpenseDescriptions = async (req, res) => {
    const query = req.query;
    const expenseModel = getExpenseModel();

    const suggestions = await expenseModel.findAll({
        attributes: ['item', [Sequelize.fn('COUNT', Sequelize.col('item')), 'usages']],
        where: {
            $and: [{project_id: req.projectId}, ...mapSearchKeywordToWheres(query.search, ['item'])],
        },
        limit: 10,
        group: 'item',
        order: [[Sequelize.literal('usages'), 'DESC']] as any,
    });

    return res.json({suggestions});
};

export const getCategories = async (req, res) => {
    const search = req.query.search;
    const words = mapSearchToWords(search);

    if (words.length) {
        const wheres = mapSearchKeywordToLiteralWheres(search, 'expenses.item');
        const row = await getDb().query(
            `
SELECT DISTINCT
   category_id 
FROM
   expenses 
   JOIN
      category_expense 
      ON category_expense.expense_id = expenses.id 
WHERE
   project_id = :projectId AND ${wheres}`,
            {
                replacements: {
                    projectId: req.projectId,
                },
                type: QueryTypes.SELECT,
            },
        );

        return res.json({
            suggestions: row.map((row) => row.category_id),
        });
    }

    res.json({suggestions: []});
};
