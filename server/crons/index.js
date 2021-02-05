const cron = require('node-cron');
const updateStocks = require('./updateStocks');

updateStocks();
cron.schedule('*/5 * * * *', updateStocks);
