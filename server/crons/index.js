const cron = require('node-cron');
const updateStocks = require('./updateStocks');

module.exports = () => {
    updateStocks();
    cron.schedule('*/10 * * * *', updateStocks);
};
