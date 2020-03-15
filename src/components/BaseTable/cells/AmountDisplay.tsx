import {numericValue} from 'components/formatters';
import {getItemCurrencyISOCode} from 'helpers';
import React from 'react';
import {useCurrencies} from 'state/currencies';

export const AmountDisplay = ({item, showCurrency = true}) => {
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
                showCurrency,
                currency: currencyISOCode,
            })}
        </>
    );
};
