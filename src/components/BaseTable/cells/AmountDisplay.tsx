import {numericValue} from 'components/formatters';
import {getItemCurrencyISOCode} from 'helpers';
import React from 'react';
import {useCurrencies} from 'state/currencies';

export const AmountDisplay = ({item}) => {
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
