// @ flow
import {getItemCurrencyISOCode} from 'common/helpers';
import {useCurrencies} from 'common/state/hooks';

const CurrencyDisplay = ({item}) => {
    const currencies = useCurrencies();
    const currencyISOCode = getItemCurrencyISOCode({
        item,
        currencies,
    });

    return currencyISOCode;
};

export default CurrencyDisplay;
