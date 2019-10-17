module.exports = {
    '/': require('./home'),
    '/api/transactions': require('./expense'),
    '/api/reports': require('./report'),
    '/get-currencies': require('./currency'),
    '/category': require('./category'),
    '/user': require('./user'),
    '/money-location': require('./money-location'),
    '/money-location-type': require('./money-location-type'),
    '/suggestion': require('./suggestion'),
};
