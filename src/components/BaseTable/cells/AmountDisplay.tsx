import {numericValue} from 'components/formatters';
import {getItemCurrencyISOCode} from 'helpers';
import React from 'react';
import {useCurrencies} from 'state/currencies';
import {TransactionModel} from 'types';

export const AmountDisplay = ({
    item,
}: {
    item: Pick<TransactionModel, 'sum' | 'money_location'>;
}) => {
    const currencies = useCurrencies();
    const currencyISOCode = getItemCurrencyISOCode({
        item,
        currencies,
    });
    const sign = item.sum > 0 ? '+' : '';

    return (
        <>
            {sign}
            {numericValue(Math.abs(item.sum), {
                currency: currencyISOCode,
            })}
        </>
    );
};
