// @flow
import {numericValue} from 'mobile/ui/formatters';
import {getItemCurrencyISOCode} from 'common/helpers';
import {useCurrencies} from 'common/state';

const AmountDisplay = ({item, showCurrency = true}) => {
    const currencies = useCurrencies();
    const currencyISOCode = getItemCurrencyISOCode({
        item,
        currencies,
    });

    return numericValue(item.sum, {
        showCurrency,
        currency: currencyISOCode,
    });
};

export default AmountDisplay;
