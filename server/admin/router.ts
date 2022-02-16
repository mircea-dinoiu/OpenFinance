import express from 'express';
import {validateAdmin} from '../middlewares';
import {backfillStockPrices} from './backfillStockPrices';
import {getExpenseModel, getCategoryModel, getAccountModel, getUserModel, getInventoryModel} from '../models';
import {stringify} from 'csv-stringify/sync';
import moment from 'moment';
import {kebabCase} from 'lodash';

export const createAdminRouter = () => {
    const router = express.Router();

    router.post('/backfill-stock-prices', validateAdmin, async (req, res) => {
        backfillStockPrices(req, res);
    });

    /**
     Date,Description,Original Description,Amount,Transaction Type,Category,Account Name,Labels,Notes
     1/23/2015,    Bookstore Invoice    ,Bookstore Invoice   ,12.34,debit,Office Supplies,,,
     1/23/2015,Gas Company,Gas Company,60.00,debit,Utilities,,,August bill
     1/23/2015,Hydro,Hydro,234.83,debit,Utilities,,,
     1/24/2015,Microsoft,Microsoft,1220.00,credit,Payroll,,,Payroll
     */
    router.get('/quicken/:accId', validateAdmin, async (req, res) => {
        const accId = req.params.accId;
        const json = await getExpenseModel()
            .scope('default')
            .findAll({
                where: {
                    project_id: {
                        $eq: 1,
                    },
                    status: {
                        $ne: 'pending',
                    },
                    money_location_id: accId,
                },
            });
        const allCategories = await getCategoryModel().findAll();
        const allAccounts = await getAccountModel().findAll();
        const allUsers = await getUserModel().findAll();
        const allInventories = await getInventoryModel().findAll();

        const output = stringify([
            [
                'Date',
                'Description',
                'Original Description',
                'Amount',
                'Transaction Type',
                'Category',
                'Account Name',
                'Labels',
                'Notes',
            ],
            ...json.map((model) => {
                const j = model.toJSON();
                const jCategories = j.categories.map((id) =>
                    allCategories.find((c) => c.get('id') === Number(id))?.get('name'),
                );
                const jAccountName = allAccounts.find((a) => a.get('id') === j.money_location_id)?.get('name');
                const hasUser = Object.keys(j.users).length === 1;
                const jUsername = allUsers
                    .find((u) => u.get('id') === Number(Object.keys(j.users)[0]))
                    ?.get('first_name');
                const jInventory =
                    j.inventory_id != null
                        ? allInventories.find((i) => i.get('id') === j.inventory_id)?.get('name')
                        : null;

                const importCategories =
                    jCategories.length > 0 ? `import-cat-${jCategories.map(kebabCase).join('+')}` : '';
                const importUser = hasUser && `import-user-${kebabCase(jUsername)}`;
                const importInventory = jInventory && `import-inv-${kebabCase(jInventory)}`;
                const isDraft = j.status === 'draft';

                return [
                    moment(j.created_at).format('M/D/YYYY'),
                    j.item,
                    j.item,
                    isDraft ? 0 : Math.abs(j.sum),
                    j.sum < 0 ? 'debit' : 'credit',
                    importCategories,
                    jAccountName,
                    [isDraft ? 'import-status-draft' : null, importUser, importInventory].filter(Boolean).join(' '),
                    j.notes,
                ];
            }),
        ]);

        res.type('text/csv');
        res.send(output);
    });

    return router;
};
