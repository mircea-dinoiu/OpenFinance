// @flow
import * as React from 'react';
import { Menu } from 'material-ui';
import { Paper } from '@material-ui/core';

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
