const {Stock, Expense} = require('../models');
const logger = require('../helpers/logger');
const yf = require('yahoo-finance');

export const updateStocks = async () => {
    const models = await Stock.findAll({
        where: {
            manual_pricing: false,
        },
    });

    models.forEach(async (model) => {
        let data;

        try {
            data = await yf.quote({symbol: model.symbol, modules: ['price']});
        } catch (e) {
            inferStockPriceFromTransactions(model);

            return;
        }

        const {regularMarketPrice: price} = data.price;

        if (price == null) {
            logger.error('Incorrect Price (', price, ') for', model.symbol);

            return;
        }

        if (model.price !== price) {
            logger.log('YAHOO', `Updating ${model.symbol} price: ${model.price} → ${price}`);
            model.update({price});
        }
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

        if (price === stock.price) {
            return;
        }

        logger.log('Stocks', `Updating ${stock.symbol} price ${stock.price} → ${price}`);
        stock.update({price});
    } else {
        logger.log('Stocks', `Unable to price ${stock.symbol}`);
    }
};
