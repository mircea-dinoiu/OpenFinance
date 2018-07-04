// @flow
import React from 'react';
import {grey700} from 'material-ui/styles/colors';
import {connect} from 'react-redux';

const DestinationDisplay = ({item, moneyLocations}) => (
    item.money_location_id && (
        <span style={{fontSize: 14, color: grey700}}>
            {moneyLocations
                .find((each) => each.get('id') === item.money_location_id)
                .get('name')}
        </span>
    )
);
const mapStateToProps = ({moneyLocations}) => ({moneyLocations});

export default connect(mapStateToProps)(DestinationDisplay);
