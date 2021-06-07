import {createTransactionsRouter} from './transactions/router';
import {createReportsRouter} from './reports/router';
import {createCurrenciesRouter} from './currencies/router';
import {createInventoriesRouter} from './inventories/router';
import {createPropertiesRouter} from './properties/router';
import {createStocksRouter} from './stocks/router';
import {createCategoriesRouter} from './categories/router';
import {createUsersRouter} from './users/router';
import {createAccountsRouter} from './accounts/router';
import {createHtmlRouter} from './html/router';
import {createAdminRouter} from './admin/router';

export const includeRoutes = (app) => {
    Object.entries({
        '/api/admin': createAdminRouter(),
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
