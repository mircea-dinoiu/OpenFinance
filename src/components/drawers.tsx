import {Drawer, Theme, useMediaQuery} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {stickyHeaderHeight} from 'defs/styles';
import React, {ReactNode} from 'react';

export const SmartDrawer = ({
    children,
    ...props
}: {
    onClose: undefined | (() => void);
    open: boolean;
    children: ReactNode;
}) => {
    const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const cls = useSmartDrawerStyles();

    return (
        <Drawer classes={cls} anchor={isSmall ? 'bottom' : 'right'} {...props}>
            {children}
        </Drawer>
    );
};

const useSmartDrawerStyles = makeStyles((theme) => ({
    paper: {
        [theme.breakpoints.down('sm')]: {
            top: stickyHeaderHeight,
        },
    },
}));
