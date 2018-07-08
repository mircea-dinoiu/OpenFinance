// @flow
import React from 'react';
import { Menu, Paper } from 'material-ui';
import ContextMenuItems from 'common/components/MainScreen/ContextMenu/ContextMenuItems';

export default function AnchoredContextMenu({ top, left, itemsProps }) {
    return (
        <Paper
            style={{ position: 'fixed', top: `${top}px`, left: `${left}px` }}
        >
            <Menu desktop={true}>
                <ContextMenuItems desktop={true} {...itemsProps} />
            </Menu>
        </Paper>
    );
}
