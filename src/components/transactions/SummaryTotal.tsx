import {AccountValue} from 'components/transactions/AccountValue';
import {SummaryModel} from 'components/transactions/types';
import groupBy from 'lodash/groupBy';
import React from 'react';

export const SummaryTotal = ({
    summaryItems,
    excludedRecord,
    colorize,
}: {
    summaryItems: Pick<SummaryModel, 'cashValue' | 'stocks' | 'reference' | 'currencyId'>[];
    excludedRecord?: Record<string, boolean>;
    colorize?: boolean;
}) => {
    return (
        <>
            {Object.entries(groupBy(summaryItems, 'currencyId')).map(([currencyId, items]) => {
                let cashValue = 0;
                const stocksMap = new Map();

                items.forEach((item) => {
                    cashValue += !excludedRecord?.[item.reference] ? item.cashValue ?? 0 : 0;

                    item.stocks?.forEach((stock) => {
                        stocksMap.set(stock.stock_id, (stocksMap.get(stock.stock_id) ?? 0) + stock.stock_units);
                    });
                });

                return (
                    <AccountValue
                        stocks={Array.from(stocksMap.entries()).map(([id, units]) => ({
                            stock_units: units,
                            stock_id: id,
                        }))}
                        cashValue={cashValue}
                        colorize={colorize}
                        currencyId={Number(currencyId)}
                    />
                );
            })}
        </>
    );
};
