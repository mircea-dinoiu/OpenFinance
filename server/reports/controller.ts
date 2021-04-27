import {ExpenseService} from '../transactions/ExpenseService';
import {SummaryReportService} from './SummaryReportService';
import {getUserModel, getCategoryModel, getAccountModel, getCurrencyModel} from '../models';
import logger from '../helpers/logger';

export class ReportController {
    async getSummary(req, res) {
        const User = getUserModel();
        const Category = getCategoryModel();
        const MoneyLocation = getAccountModel();
        const Currency = getCurrencyModel();
        const pullStart = Date.now();

        const [expenseRecords, userRecords, mlRecords, categoryRecords, currencyRecords] = await Promise.all([
            ExpenseService.list(req),
            User.findAll(),
            MoneyLocation.findAll(),
            Category.findAll(),
            Currency.findAll(),
        ]);

        logger.log('ReportController.getSummary', 'Pulling took', Date.now() - pullStart, 'millis');

        if (expenseRecords.error) {
            res.status(400);
            res.json(expenseRecords.json);

            return;
        }

        const processingStart = Date.now();

        const mlIdToCurrencyId = mlRecords.reduce((acc, each) => {
            acc[each.id] = each.currency_id;

            return acc;
        }, {});
        const userIdToFullName = userRecords.reduce((acc, each) => {
            acc[each.id] = each.full_name;

            return acc;
        }, {});
        const currencyIdToISOCode = currencyRecords.reduce((acc, each) => {
            acc[each.id] = each.iso_code;

            return acc;
        }, {});
        const common = {
            mlIdToCurrencyId,
            userIdToFullName,
            currencyIdToISOCode,
            html: req.query.html,
        };
        const expenseRecordsAsJSON = expenseRecords.json;

        const transactions = SummaryReportService.getTransactions({
            expenseRecords: expenseRecordsAsJSON,
            userRecords,
            mlRecords,
            ...common,
        });

        const expensesByCategory = SummaryReportService.getExpensesByCategory({
            expenseRecords: expenseRecordsAsJSON,
            categoryRecords,
            ...common,
        });

        const remainingData = SummaryReportService.getBalances({
            expenses: transactions,
            ...common,
        });

        logger.log(
            'ReportController.getSummary',
            'Processing took',
            Date.now() - processingStart,
            'millis',
            `(expenses: ${expenseRecords.json.length})`,
        );

        res.json({
            expensesByCategory,
            remainingData,
        });
    }
}
