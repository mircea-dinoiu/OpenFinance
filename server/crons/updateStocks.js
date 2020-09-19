const {Stock} = require('../models');
const finnhub = require('finnhub');
const logger = require('../helpers/logger');

finnhub.ApiClient.instance.authentications['api_key'].apiKey = process.env.FINNHUB_API_KEY;
const finnhubClient = new finnhub.DefaultApi();

module.exports = async () => {
    const models = await Stock.findAll();

    models.forEach((model) => {
        finnhubClient.quote(model.symbol, (error, data, response) => {
            if (!error) {
                const {c: price} = data;

                if (model.price !== price) {
                    logger.log('FINNHUB', `Updating ${model.symbol} price: ${model.price} → ${price}`);
                    model.update({price});
                }
            } else {
                logger.error(error);
            }
        });
    });
};
