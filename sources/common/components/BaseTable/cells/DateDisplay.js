// @flow
import React from 'react';
import { grey } from '@material-ui/core/colors';
import moment from 'moment';
import { connect } from 'react-redux';
import Tooltip from 'common/components/Tooltip';

const DateDisplay = ({ item, screen }) => (
    <span
        style={{
            fontSize: 14,
            color: screen.isLarge ? 'inherit' : grey[500],
        }}
    >
        <Tooltip
            tooltip={`Last updated: ${moment(item.updated_at).format('lll')}`}
        >
            {moment(item.created_at).format('lll')}
        </Tooltip>
    </span>
);
const mapStateToProps = ({ screen }) => ({ screen });

export default connect(mapStateToProps)(DateDisplay);
