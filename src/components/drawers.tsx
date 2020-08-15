import {Drawer} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {ScreenQuery, stickyHeaderHeight} from 'defs/styles';
import React, {ReactNode} from 'react';
import {useScreenSize} from 'state/hooks';

export const SmartDrawer = ({
    children,
    ...props
}: {
    onClose: undefined | (() => void);
    open: boolean;
    children: ReactNode;
}) => {
    const screenSize = useScreenSize();
    const cls = useSmartDrawerStyles();

    return (
        <Drawer
            classes={cls}
            anchor={screenSize.isSmall ? 'bottom' : 'right'}
            {...props}
        >
            {children}
        </Drawer>
    );
};

const useSmartDrawerStyles = makeStyles({
    root: {
        [ScreenQuery.SMALL]: {
            paddingTop: stickyHeaderHeight,
        },
    },
});
