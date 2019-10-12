import {numericValue} from 'components/formatters';
import {getItemCurrencyISOCode} from 'helpers';
import {useCurrencies} from 'state/hooks';

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
