// @flow
import { connect } from 'react-redux';
import { getItemCurrencyISOCode } from 'common/helpers';

const CurrencyISOCodeDisplay = ({ item, currencies }) =>
    getItemCurrencyISOCode(item, currencies);
const mapStateToProps = ({ currencies }) => ({ currencies });

export default connect(mapStateToProps)(CurrencyISOCodeDisplay);
