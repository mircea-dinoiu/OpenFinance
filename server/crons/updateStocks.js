const {Stock, Expense} = require('../models');
const finnhub = require('finnhub');
const logger = require('../helpers/logger');

finnhub.ApiClient.instance.authentications['api_key'].apiKey = process.env.FINNHUB_API_KEY;
const finnhubClient = new finnhub.DefaultApi();

module.exports = async () => {
    const models = await Stock.findAll();

    models.forEach(async (model) => {
        finnhubClient.quote(model.symbol, async (error, data, response) => {
            if (!error) {
                const {c: price} = data;

                if (model.price !== price) {
                    if (price === 0) {
                        inferStockPriceFromTransactions(model);
                    } else {
                        logger.log('FINNHUB', `Updating ${model.symbol} price: ${model.price} → ${price}`);
                        model.update({price});
                    }
                }
            } else {
                logger.error(error);
            }
        });
    });
};

const inferStockPriceFromTransactions = async (stock) => {
    const transaction = await Expense.findOne({
        where: {
            stock_id: stock.id,
        },
        order: [['created_at', 'DESC']],
    });

    if (transaction) {
        const price = transaction.price;

        if (price <= stock.price) {
            return;
        }

        logger.log('Stocks', `Updating ${stock.symbol} price ${stock.price} → ${price}`);
        stock.update({price});
    } else {
        logger.log('Stocks', `Unable to price ${stock.symbol}`);
    }
};
