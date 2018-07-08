// @flow
import { numericValue } from 'mobile/ui/formatters';
import { getItemCurrencyISOCode } from 'common/helpers';
import { connect } from 'react-redux';

const AmountDisplay = ({ item, currencies, showCurrency = false }) => {
    const currencyISOCode = getItemCurrencyISOCode(item, currencies);

    return numericValue(item.sum, {
        showCurrency,
        currency: currencyISOCode,
    });
};
const mapStateToProps = ({ currencies }) => ({ currencies });

export default connect(mapStateToProps)(AmountDisplay);
