import {getStockModel, getExpenseModel, getStockPriceModel} from '../models';
import {StockPricingMethod, TStockPrice} from '../../src/stocks/defs';
import Sequelize from 'sequelize';
import {formatYMD} from '../../src/app/dates/formatYMD';
import _ from 'lodash';
import moment from 'moment';
import yf from 'yahoo-finance';

export const backfillStockPrices = async (req, res) => {
    const stocks = await getStockModel().findAll({
        where: {
            pricing_method: {
                $ne: StockPricingMethod.MANUAL,
            },
        },
    });
    const messages: Record<string, string[]> = {};

    await Promise.all(
        stocks.map(async (stock) => {
            const trades = await getExpenseModel().findAll({
                attributes: ['created_at', 'price'],
                where: {
                    stock_id: stock.id,
                },
                group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
                order: [['created_at', 'asc']],
            });
            const [oldestTrade] = trades;

            if (!oldestTrade) {
                return;
            }

            const datesWithPrices = (
                await getStockPriceModel().findAll({
                    attributes: ['dated'],
                    where: {
                        stock_id: stock.id,
                    },
                })
            ).map((s) => formatYMD(s.dated));

            const daysToFill = getDaysToFill({
                datesWithPrices,
                oldestDate: oldestTrade.created_at,
            });

            messages[stock.symbol] = [];

            if (daysToFill.length === 0) {
                return;
            }

            let records: TStockPrice[] = [];

            if (stock.pricing_method === StockPricingMethod.EXCHANGE) {
                const quotes = _.groupBy(
                    await yf.historical({
                        symbol: stock.symbol,
                        from: daysToFill[0],
                        to: _.last(daysToFill),
                        period: 'd',
                    }),
                    (q) => formatYMD(q.date),
                );

                records = daysToFill.reduce((acc: TStockPrice[], dated) => {
                    const [quote] = quotes[dated] ?? [];

                    if (quote && quote.adjClose) {
                        const record: TStockPrice = {
                            stock_id: stock.id,
                            dated: dated,
                            price: quote.adjClose,
                        };

                        messages[stock.symbol].push(`Created: ${JSON.stringify(record)}`);

                        return acc.concat(record);
                    }

                    return acc;
                }, []);
            } else if (stock.pricing_method === StockPricingMethod.INFER) {
                records = trades.reduce((acc: TStockPrice[], trade) => {
                    const dated = formatYMD(trade.created_at);

                    if (daysToFill.includes(dated)) {
                        const record: TStockPrice = {
                            stock_id: stock.id,
                            dated: dated,
                            price: trade.price,
                        };

                        messages[stock.symbol].push(`Created: ${JSON.stringify(record)}`);

                        return acc.concat(record);
                    }

                    return acc;
                }, []);
            }

            await getStockPriceModel().bulkCreate(records);
        }),
    );

    res.json(messages);
};

const getDaysToFill = ({datesWithPrices, oldestDate}: {datesWithPrices: string[]; oldestDate: number}) => {
    const daysBack = moment().diff(moment(oldestDate), 'days');
    const daysToFill: string[] = [];

    for (let i = 0; i <= daysBack; i++) {
        const dayDate = formatYMD(
            moment(oldestDate)
                .add(i, 'days')
                .toDate(),
        );

        if (!datesWithPrices.includes(dayDate)) {
            daysToFill.push(dayDate);
        }
    }

    return daysToFill;
};
