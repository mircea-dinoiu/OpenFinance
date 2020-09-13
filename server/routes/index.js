module.exports = {
    '/api/transactions': require('./transactions'),
    '/api/reports': require('./reports'),
    '/api/currencies': require('./currencies'),
    '/api/stocks': require('./stocks'),
    '/api/categories': require('./categories'),
    '/api/users': require('./users'),
    '/api/money-locations': require('./accounts'),
    '/api/money-location-types': require('./account-types'),
    '/': require('./html'),
};
