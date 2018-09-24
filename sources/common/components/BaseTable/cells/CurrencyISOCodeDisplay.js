// @flow
import { connect } from 'react-redux';
import { getItemCurrencyISOCode } from 'common/helpers';

const CurrencyISOCodeDisplay = ({ item, currencies, moneyLocations }) =>
    getItemCurrencyISOCode({ item, currencies, moneyLocations });
const mapStateToProps = ({ currencies, moneyLocations }) => ({
    currencies,
    moneyLocations,
});

export default connect(mapStateToProps)(CurrencyISOCodeDisplay);
