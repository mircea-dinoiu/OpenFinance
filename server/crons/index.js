const cron = require('node-cron');
const updateStocks = require('./updateStocks');

updateStocks();
cron.schedule('0 0 */1 * * *', updateStocks);
