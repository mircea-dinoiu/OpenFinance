// @flow
import React from 'react';
import {MenuItem} from 'material-ui';
import DeleteIcon from 'material-ui-icons/Delete';
import CreateIcon from 'material-ui-icons/Create';

export default function ContextMenuItems({onClickEdit, onClickDelete, selectedIds, desktop = false}) {
    return (
        <React.Fragment>
            <MenuItem
                primaryText="Edit"
                leftIcon={<CreateIcon />}
                onTouchTap={onClickEdit}
                disabled={selectedIds.length !== 1}
            />
            <MenuItem
                primaryText="Delete"
                leftIcon={<DeleteIcon />}
                onTouchTap={onClickDelete}
                disabled={selectedIds.length === 0}
            />
        </React.Fragment>
    );
}
