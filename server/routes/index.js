module.exports = {
    '/api/transactions': require('./expense'),
    '/api/reports': require('./report'),
    '/api/currencies': require('./currency'),
    '/api/categories': require('./category'),
    '/api/users': require('./user'),
    '/api/money-locations': require('./money-location'),
    '/api/money-location-types': require('./money-location-type'),
    '/': require('./home'),
};
