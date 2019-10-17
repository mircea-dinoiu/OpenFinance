import {numericValue} from 'components/formatters';
import {getItemCurrencyISOCode} from 'helpers';
import {useCurrencies} from 'state/hooks';
import React from 'react';

const AmountDisplay = ({item, showCurrency = true}) => {
    const currencies = useCurrencies();
    const currencyISOCode = getItemCurrencyISOCode({
        item,
        currencies,
    });
    const sign = item.sum >= 0 ? '+' : '';

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

export default AmountDisplay;
