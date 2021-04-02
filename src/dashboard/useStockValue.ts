import {BalanceByLocationStock} from 'components/transactions/types';
import {useStockPrices} from 'stocks/state';

export const useStockValue = (stocks: Omit<BalanceByLocationStock, 'money_location_id'>[]) => {
    const stockPrices = useStockPrices();

    return getStockValue(stocks, stockPrices);
};

export const getStockValue = (
    stocks: Omit<BalanceByLocationStock, 'money_location_id'>[],
    stockPrices: Map<number, number>,
) => {
    return stocks.reduce((acc, stock) => {
        return acc + stock.quantity * (stockPrices.get(stock.stock_id) ?? 0);
    }, 0);
};
