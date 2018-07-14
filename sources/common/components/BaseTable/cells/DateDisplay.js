// @flow
import React from 'react';
import { grey } from '@material-ui/core/colors';
import moment from 'moment';
import { connect } from 'react-redux';

const DateDisplay = ({ item, screen }) => (
    <span
        style={{
            fontSize: 14,
            color: screen.isLarge ? 'inherit' : grey[500],
        }}
    >
        {moment(item.created_at).format('lll')}
    </span>
);
const mapStateToProps = ({ screen }) => ({ screen });

export default connect(mapStateToProps)(DateDisplay);
