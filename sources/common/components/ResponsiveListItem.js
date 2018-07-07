// @flow
import React from 'react';
import { ListItem } from 'material-ui';
import { connect } from 'react-redux';
import omit from 'lodash/omit';

const ResponsiveListItem = ({ screen, ...props }) => (
    <ListItem
        {...omit(props, 'dispatch')}
        innerDivStyle={{
            ...(screen.isLarge
                ? {
                    paddingTop: 5,
                    paddingBottom: 5,
                }
                : {}),
            ...props.innerDivStyle,
        }}
    />
);

export default connect(({ screen }) => ({ screen }))(ResponsiveListItem);
