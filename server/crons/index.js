const cron = require('node-cron');
const updateStocks = require('./updateStocks');

updateStocks();
cron.schedule('*/10 * * * *', updateStocks);
