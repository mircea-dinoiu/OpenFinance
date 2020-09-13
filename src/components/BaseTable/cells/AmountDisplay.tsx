import {Chip} from '@material-ui/core';
import {NumericValue} from 'components/formatters';
import {TransactionModel} from 'components/transactions/types';
import {getItemCurrencyISOCode} from 'helpers';
import React from 'react';
import {useCurrenciesMap} from 'state/currencies';
import {useStocks} from 'state/stocks';

export const AmountDisplay = ({
    item,
}: {
    item: Pick<
        TransactionModel,
        'sum' | 'money_location' | 'stock_units' | 'stock_id'
    >;
}) => {
    const currencies = useCurrenciesMap();
    const currencyISOCode = getItemCurrencyISOCode({
        item,
        currencies,
    });
    const stocks = useStocks();

    return (
        <>
            <NumericValue value={item.sum} currency={currencyISOCode} />
            {item.stock_units && item.stock_id ? (
                <div>
                    <Chip
                        label={
                            item.stock_units +
                            ' ' +
                            stocks.find((s) => s.id === item.stock_id)?.symbol
                        }
                        size="small"
                    />
                </div>
            ) : null}
        </>
    );
};
