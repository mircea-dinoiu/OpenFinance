import {Dialog, Drawer} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {stickyHeaderTop} from 'defs/styles';
import React, {ReactNode} from 'react';
import {useScreenSize} from 'state/hooks';

export const DialogOrDrawer = ({
    children,
    ...props
}: {
    onClose: () => void;
    open: boolean;
    children: ReactNode;
}) => {
    const screenSize = useScreenSize();
    const cls = useStyles();

    if (screenSize.isLarge) {
        return <Dialog {...props}>{children}</Dialog>;
    }

    return (
        <Drawer classes={cls} anchor="bottom" {...props}>
            {children}
        </Drawer>
    );
};

const useStyles = makeStyles({
    paper: {
        top: stickyHeaderTop,
    },
});
