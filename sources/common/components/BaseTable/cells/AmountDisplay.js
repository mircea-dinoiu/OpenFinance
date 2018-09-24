// @flow
import { numericValue } from 'mobile/ui/formatters';
import { getItemCurrencyISOCode } from 'common/helpers';
import { connect } from 'react-redux';

const AmountDisplay = ({
    item,
    currencies,
    showCurrency = false,
    moneyLocations,
}) => {
    const currencyISOCode = getItemCurrencyISOCode({
        item,
        currencies,
        moneyLocations,
    });

    return numericValue(item.sum, {
        showCurrency,
        currency: currencyISOCode,
    });
};
const mapStateToProps = ({ currencies, moneyLocations }) => ({
    currencies,
    moneyLocations,
});

export default connect(mapStateToProps)(AmountDisplay);
