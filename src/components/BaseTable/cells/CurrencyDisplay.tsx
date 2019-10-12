import React from 'react';
import {getItemCurrencyISOCode} from 'helpers';
import {useCurrencies} from 'state/hooks';

const CurrencyDisplay = ({item}) => {
    const currencies = useCurrencies();
    const currencyISOCode = getItemCurrencyISOCode({
        item,
        currencies,
    });

    return <>{currencyISOCode}</>;
};

export default CurrencyDisplay;
