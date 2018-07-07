// @flow
import React from 'react';
import { grey500 } from 'material-ui/styles/colors';
import moment from 'moment';
import { connect } from 'react-redux';

const DateDisplay = ({ item, screen }) => (
    <span
        style={{
            fontSize: 14,
            color: screen.isLarge ? 'inherit' : grey500,
        }}
    >
        {moment(item.created_at).format('lll')}
    </span>
);
const mapStateToProps = ({ screen }) => ({ screen });

export default connect(mapStateToProps)(DateDisplay);
