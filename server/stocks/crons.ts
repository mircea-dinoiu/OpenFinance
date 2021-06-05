import {getStockModel, getExpenseModel, getStockPriceModel} from '../models';
import logger from '../helpers/logger';
import yf from 'yahoo-finance';
import {StockPricingMethod, TStock, TStockPrice} from '../../src/stocks/defs';
import sequelize from 'sequelize';
import {formatYMD} from '../../src/app/dates/formatYMD';

export const updateStocks = async () => {
    const models = await getStockModel().findAll({
        where: {
            pricing_method: {
                $ne: StockPricingMethod.MANUAL,
            },
        },
    });

    const dated = formatYMD(new Date());

    models.forEach(async (model) => {
        if (model.pricing_method === StockPricingMethod.INFER) {
            inferStockPriceFromTransactions(model, dated);

            return;
        }

        const data = await yf.quote({symbol: model.symbol, modules: ['price']});

        const {regularMarketPrice: price} = data.price;

        if (price == null) {
            logger.error('Incorrect Price (', price, ') for', model.symbol);

            return;
        }

        updateStockPrice(model, {
            dated,
            price,
        });
    });
};

const updateStockPrice = async (model: sequelize.Model<TStock>, {dated, price}: Omit<TStockPrice, 'stock_id'>) => {
    const stockPriceModel = getStockPriceModel();
    const stockPrice = await stockPriceModel.find({
        where: {
            stock_id: model.id,
            dated,
        },
    });

    if (stockPrice) {
        if (stockPrice.price !== price) {
            logger.log('YAHOO', `Updating ${model.symbol} price: ${model.price} → ${price}`);
            stockPrice.update({price});
        }
    } else {
        logger.log('YAHOO', `Creating ${model.symbol} price: ${model.price} → ${price}`);
        stockPriceModel.create({
            stock_id: model.id,
            dated,
            price,
        });
    }
};

const inferStockPriceFromTransactions = async (stock, dated) => {
    const transaction = await getExpenseModel().findOne({
        where: {
            stock_id: stock.id,
        },
        order: [['created_at', 'DESC']],
    });

    if (transaction) {
        const price = transaction.price;

        updateStockPrice(stock, {
            dated,
            price,
        });
    } else {
        logger.log('Stocks', `Unable to price ${stock.symbol}`);
    }
};
