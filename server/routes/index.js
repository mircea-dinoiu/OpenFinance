module.exports = {
    '/api/transactions': require('./transactions'),
    '/api/reports': require('./reports'),
    '/api/currencies': require('./currencies'),
    '/api/inventories': require('./inventories'),
    '/api/properties': require('./properties'),
    '/api/stocks': require('./stocks'),
    '/api/categories': require('./categories'),
    '/api/users': require('./users'),
    '/api/money-locations': require('./accounts'),
    '/': require('./html'),
};
