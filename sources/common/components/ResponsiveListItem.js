// @flow
import React from 'react';
import {ListItem} from 'material-ui';
import {connect} from 'react-redux';

const ResponsiveListItem = ({screen, ...props}) => {
    return (
        <ListItem {...props} innerDivStyle={{
            ...(screen.isLarge ? ({
                paddingTop: 5,
                paddingBottom: 5
            }) : {}),
            ...props.innerDivStyle
        }}/>
    );
};

export default connect(({screen}) => ({screen}), null)(ResponsiveListItem);