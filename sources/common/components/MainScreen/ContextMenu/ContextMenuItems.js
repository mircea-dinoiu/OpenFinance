// @flow
import React from 'react';
import { MenuItem, Divider } from 'material-ui';
import DeleteIcon from 'material-ui-icons/Delete';
import CreateIcon from 'material-ui-icons/Create';
import DuplicateIcon from 'material-ui-icons/ContentCopy';
import DetachIcon from 'material-ui-icons/ViewAgenda';
import LockIcon from 'material-ui-icons/Lock';
import UnlockIcon from 'material-ui-icons/LockOpen';

export default function ContextMenuItems({
    onClickEdit,
    onClickDelete,
    onClickDuplicate,
    onClickDetach,
    onClickReviewed,
    onClickNeedsReview,
    selectedIds,
    desktop = false,
}) {
    const disabledForMultiple = selectedIds.length !== 1;
    const disabledForZero = selectedIds.length === 0;

    return (
        <React.Fragment>
            <MenuItem
                primaryText="Edit"
                leftIcon={<CreateIcon />}
                onClick={onClickEdit}
                onTouchTap={onClickEdit}
                disabled={disabledForMultiple}
                desktop={desktop}
            />
            <MenuItem
                primaryText="Duplicate"
                leftIcon={<DuplicateIcon />}
                onClick={onClickDuplicate}
                onTouchTap={onClickDuplicate}
                disabled={disabledForZero}
                desktop={desktop}
            />
            <MenuItem
                primaryText="Delete"
                leftIcon={<DeleteIcon />}
                onClick={onClickDelete}
                onTouchTap={onClickDelete}
                disabled={disabledForZero}
                desktop={desktop}
            />
            <Divider />
            <MenuItem
                primaryText="Detach"
                leftIcon={<DetachIcon />}
                onClick={onClickDetach}
                onTouchTap={onClickDetach}
                disabled={disabledForZero}
                desktop={desktop}
            />
            <MenuItem
                primaryText="Mark as reviewed"
                leftIcon={<LockIcon />}
                onClick={onClickReviewed}
                onTouchTap={onClickReviewed}
                disabled={disabledForZero}
                desktop={desktop}
            />
            <MenuItem
                primaryText="Mark as needs review"
                leftIcon={<UnlockIcon />}
                onClick={onClickNeedsReview}
                onTouchTap={onClickNeedsReview}
                disabled={disabledForZero}
                desktop={desktop}
            />
        </React.Fragment>
    );
}
