import {createTransactionsRouter} from './routes/transactions';
import {createReportsRouter} from './routes/reports';
import {createCurrenciesRouter} from './routes/currencies';
import {createInventoriesRouter} from './routes/inventories';
import {createPropertiesRouter} from './routes/properties';
import {createStocksRouter} from './routes/stocks';
import {createCategoriesRouter} from './routes/categories';
import {createUsersRouter} from './routes/users';
import {createAccountsRouter} from './routes/accounts';
import {createHtmlRouter} from './routes/html';

export const includeRoutes = (app) => {
    Object.entries({
        '/api/transactions': createTransactionsRouter(),
        '/api/reports': createReportsRouter(),
        '/api/currencies': createCurrenciesRouter(),
        '/api/inventories': createInventoriesRouter(),
        '/api/properties': createPropertiesRouter(),
        '/api/stocks': createStocksRouter(),
        '/api/categories': createCategoriesRouter(),
        '/api/users': createUsersRouter(),
        '/api/money-locations': createAccountsRouter(),
        '/': createHtmlRouter(),
    }).forEach(([route, router]) => {
        app.use(route, router);
    });
};
