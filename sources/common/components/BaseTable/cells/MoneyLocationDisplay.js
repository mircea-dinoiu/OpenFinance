// @flow
import * as React from 'react';
import grey from '@material-ui/core/colors/grey';

import { connect } from 'react-redux';

const MoneyLocationDisplay = ({ item, moneyLocations }) =>
    item.money_location_id && (
        <span style={{ fontSize: 14, color: grey[700] }}>
            {moneyLocations
                .find((each) => each.get('id') === item.money_location_id)
                .get('name')}
        </span>
    );
const mapStateToProps = ({ moneyLocations }) => ({ moneyLocations });

export default connect(mapStateToProps)(MoneyLocationDisplay);
