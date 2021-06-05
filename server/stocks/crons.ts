import {getStockModel, getStockPriceModel} from '../models';
import logger from '../helpers/logger';
import yf from 'yahoo-finance';
import {StockPricingMethod, TStock, TStockPrice} from '../../src/stocks/defs';
import sequelize, {QueryTypes} from 'sequelize';
import {formatYMD} from '../../src/app/dates/formatYMD';
import {getDb} from '../getDb';

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

        if (typeof price !== 'number') {
            logger.error('StockPrices', '[YAHOO]', 'Incorrect Price (', price, ') for', model.symbol);

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
            logger.log('StockPrices', `Updating ${model.symbol} price: ${stockPrice.price} →`, price);
            stockPrice.update({price});
        }
    } else {
        logger.log('StockPrices', `Creating ${model.symbol} price:`, price);
        stockPriceModel.create({
            stock_id: model.id,
            dated,
            price,
        });
    }
};

const inferStockPriceFromTransactions = async (stock, dated) => {
    const sql = getDb();
    const [transaction] = await sql.query(
        `
        SELECT expenses.price 
        FROM expenses 
        WHERE expenses.stock_id = :queryStockId
        ORDER BY ABS(DATEDIFF(:queryDate, expenses.created_at)) ASC, expenses.price DESC LIMIT 1
    `,
        {
            replacements: {
                queryStockId: stock.id,
                queryDate: dated,
            },
            type: QueryTypes.SELECT,
        },
    );

    if (transaction) {
        const price = transaction.price;

        updateStockPrice(stock, {
            dated,
            price,
        });
    } else {
        logger.log(
            'StockPrices',
            '[INFER]',
            `Unable to price ${stock.symbol}. Reason: no transactions using this stock symbol`,
        );
    }
};
