import * as React from 'react';
import {ListItem} from 'material-ui';
import omit from 'lodash/omit';
import {useScreenSize} from 'state/hooks';

const ResponsiveListItem = (props) => {
    const screen = useScreenSize();

    return (
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
};

export default ResponsiveListItem;
