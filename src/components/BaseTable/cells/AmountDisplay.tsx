import {NumericValue} from 'components/formatters';
import {TransactionModel} from 'components/transactions/types';
import {getItemCurrencyISOCode} from 'helpers';
import React from 'react';
import {useCurrenciesMap} from 'state/currencies';

export const AmountDisplay = ({
    item,
}: {
    item: Pick<TransactionModel, 'sum' | 'money_location'>;
}) => {
    const currencies = useCurrenciesMap();
    const currencyISOCode = getItemCurrencyISOCode({
        item,
        currencies,
    });

    return <NumericValue value={item.sum} currency={currencyISOCode} />;
};
