// @flow
import { getItemCurrencyISOCode } from 'common/helpers';
import { connect } from 'react-redux';

const CurrencyDisplay = ({
   item,
   currencies,
}) => {
    const currencyISOCode = getItemCurrencyISOCode({
        item,
        currencies,
    });

    return currencyISOCode;
};
const mapStateToProps = ({ currencies }) => ({
    currencies,
});

export default connect(mapStateToProps)(CurrencyDisplay);
