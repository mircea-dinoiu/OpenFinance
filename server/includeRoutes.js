const transactions = require('./routes/transactions');
const reports = require('./routes/reports');
const currencies = require('./routes/currencies');
const inventories = require('./routes/inventories');
const properties = require('./routes/properties');
const stocks = require('./routes/stocks');
const categories = require('./routes/categories');
const users = require('./routes/users');
const accounts = require('./routes/accounts');
const html = require('./routes/html');

module.exports = (app) => {
    Object.entries({
        '/api/transactions': transactions(),
        '/api/reports': reports(),
        '/api/currencies': currencies(),
        '/api/inventories': inventories(),
        '/api/properties': properties(),
        '/api/stocks': stocks(),
        '/api/categories': categories(),
        '/api/users': users(),
        '/api/money-locations': accounts(),
        '/': html(),
    }).forEach(([route, router]) => {
        app.use(route, router);
    });
};
