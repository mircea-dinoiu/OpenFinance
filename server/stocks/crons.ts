import {getStockModel, getExpenseModel} from '../models';
import logger from '../helpers/logger';
import yf from 'yahoo-finance';
import {StockPricingMethod} from '../../src/stocks/defs';

export const updateStocks = async () => {
    const models = await getStockModel().findAll({
        where: {
            pricing_method: {
                $ne: StockPricingMethod.MANUAL,
            },
        },
    });

    models.forEach(async (model) => {
        if (model.pricing_method === StockPricingMethod.INFER) {
            inferStockPriceFromTransactions(model);

            return;
        }

        const data = await yf.quote({symbol: model.symbol, modules: ['price']});

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
    const transaction = await getExpenseModel().findOne({
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
