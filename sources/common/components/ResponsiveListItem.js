// @flow
import React from 'react';
import {ListItem} from 'material-ui';
import {connect} from 'react-redux';

const ResponsiveListItem = (props) => (
    <ListItem {...props} innerDivStyle={{
        ...(props.screen.isLarge ? ({
            paddingTop: 5,
            paddingBottom: 5
        }) : {}),
        ...props.innerDivStyle
    }}/>
);

export default connect(({screen}) => ({screen}))(ResponsiveListItem);