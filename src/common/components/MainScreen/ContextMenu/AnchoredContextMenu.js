// @ flow
import * as React from 'react';
import {Menu} from 'material-ui';
import {Paper} from '@material-ui/core';

export type TypeAnchoredContextMenuDisplayProps = {|
    display: boolean,
    left: number,
    top: number,
|};

export default function AnchoredContextMenu({
    top,
    left,
    display,
    children,
}: {
    ...TypeAnchoredContextMenuDisplayProps,
    children: React.Node,
}) {
    return (
        display && (
            <Paper
                style={{position: 'fixed', top: `${top}px`, left: `${left}px`}}
            >
                <Menu desktop={true}>{children}</Menu>
            </Paper>
        )
    );
}
