import {formatNumber, NumericValue} from 'components/formatters';
import {useStockValue} from 'components/summary/useStockValue';
import {BalanceByLocationStock} from 'components/transactions/types';
import {financialNum} from 'js/utils/numbers';
import React from 'react';
import {useCurrenciesMap} from 'state/currencies';
import {useStockPrices, useStockSymbols} from 'state/stocks';

export const AccountValue = ({
    stocks,
    cashValue,
    colorize,
    currencyId,
}: {
    stocks: Omit<BalanceByLocationStock, 'money_location_id'>[];
    cashValue: number;
    colorize?: boolean;
    currencyId: number;
}) => {
    const currencies = useCurrenciesMap();
    const currency = currencies[currencyId].iso_code;
    const stockPrices = useStockPrices();
    const stockSymbols = useStockSymbols();
    const marketValue = useStockValue(stocks);

    if (marketValue) {
        const roi = marketValue - cashValue;

        return (
            <div>
                <NumericValue
                    currency={currency}
                    value={financialNum(marketValue)}
                    colorize={colorize}
                    tooltip={[
                        <>
                            <div>
                                Invested:{' '}
                                {<NumericValue currency={currency} value={financialNum(cashValue)} colorize={false} />}
                            </div>
                            <div>
                                ROI: {<NumericValue currency={currency} value={financialNum(roi)} colorize={false} />} (
                                {financialNum((roi / cashValue) * 100)}%)
                            </div>
                        </>,
                        <table>
                            <tr>
                                <th>Units</th>
                                <th>Symbol</th>
                                <th>Total</th>
                            </tr>
                            {stocks.map((s) => (
                                <tr key={s.stock_id}>
                                    <td>{formatNumber(s.stock_units)}</td>
                                    <td>{stockSymbols.get(s.stock_id)}</td>
                                    <td>
                                        <NumericValue
                                            currency={currency}
                                            value={s.stock_units * (stockPrices.get(s.stock_id) ?? 0)}
                                            colorize={false}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </table>,
                    ]}
                />
            </div>
        );
    }

    return (
        <div>
            <NumericValue currency={currency} value={financialNum(cashValue)} colorize={colorize} />
        </div>
    );
};
