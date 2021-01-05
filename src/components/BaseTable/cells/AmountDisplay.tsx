import {NumericValue} from 'components/formatters';
import {TransactionModel} from 'components/transactions/types';
import {getItemCurrencyISOCode} from 'helpers';
import React from 'react';
import {useCurrenciesMap} from 'state/currencies';

export const AmountDisplay = ({
    item,
}: {
    item: Pick<TransactionModel, 'price' | 'money_location' | 'quantity' | 'stock_id'>;
}) => {
    const currencies = useCurrenciesMap();
    const currencyISOCode = getItemCurrencyISOCode({
        item,
        currencies,
    });

    return <NumericValue colorize={true} value={item.price * item.quantity} currency={currencyISOCode} />;
};
