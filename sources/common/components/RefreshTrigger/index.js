// @flow
import React from 'react';
import {RefreshIndicator, Subheader} from 'material-ui';
import ReactPullToRefresh from 'react-pull-to-refresh';
import {connect} from 'react-redux';

const buttonStyle = {display: 'block', position: 'relative', margin: '10px auto 0'};

const RefreshTrigger = ({onRefresh, refreshing, screen}) => {
    if (screen.isLarge) {
        return null;
    }

    const refreshIndicator = (
        <RefreshIndicator
            size={40}
            left={10}
            top={0}
            status="loading"
            style={buttonStyle}
        />
    );

    return (
        <ReactPullToRefresh
            onRefresh={onRefresh}
        >
            {refreshing ? (
                refreshIndicator
            ) : (
                <Subheader style={{textAlign: 'center'}}>Pull down to refresh</Subheader>
            )}
        </ReactPullToRefresh>
    );
};

export default connect(({screen}) => ({screen}))(RefreshTrigger);