// @flow
import React from 'react';
import { MenuItem, Divider } from 'material-ui';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import DuplicateIcon from '@material-ui/icons/FileCopy';
import DetachIcon from '@material-ui/icons/ViewAgenda';
import LockIcon from '@material-ui/icons/Lock';
import UnlockIcon from '@material-ui/icons/LockOpen';
import compose from 'common/utils/compose';

export default function ContextMenuItems({
    onClickEdit,
    onClickDelete,
    onClickDuplicate,
    onClickDetach,
    onClickReviewed,
    onClickNeedsReview,
    onCloseContextMenu,
    selectedIds,
    desktop = false,
    features,
}: {
    onClickEdit: Function,
    onClickDelete: Function,
    onClickDuplicate: Function,
    onClickDetach: Function,
    onClickReviewed: Function,
    onClickNeedsReview: Function,
    onCloseContextMenu: Function,
    selectedIds: number[],
    features: TypeMainScreenFeatures,
    desktop: boolean,
}) {
    const disabledForMultiple = selectedIds.length !== 1;
    const disabledForZero = selectedIds.length === 0;

    return (
        <React.Fragment>
            <MenuItem
                primaryText="Edit"
                leftIcon={<CreateIcon />}
                onClick={compose(
                    onCloseContextMenu,
                    onClickEdit,
                )}
                onTouchTap={compose(
                    onCloseContextMenu,
                    onClickEdit,
                )}
                disabled={disabledForMultiple}
                desktop={desktop}
            />
            {features.duplicate && (
                <MenuItem
                    primaryText="Duplicate"
                    leftIcon={<DuplicateIcon />}
                    onClick={compose(
                        onCloseContextMenu,
                        onClickDuplicate,
                    )}
                    onTouchTap={compose(
                        onCloseContextMenu,
                        onClickDuplicate,
                    )}
                    disabled={disabledForZero}
                    desktop={desktop}
                />
            )}
            <MenuItem
                primaryText="Delete"
                leftIcon={<DeleteIcon />}
                onClick={compose(
                    onCloseContextMenu,
                    onClickDelete,
                )}
                onTouchTap={compose(
                    onCloseContextMenu,
                    onClickDelete,
                )}
                disabled={disabledForZero}
                desktop={desktop}
            />
            <Divider />
            {features.repeat && (
                <MenuItem
                    primaryText="Detach"
                    leftIcon={<DetachIcon />}
                    onClick={compose(
                        onCloseContextMenu,
                        onClickDetach,
                    )}
                    onTouchTap={compose(
                        onCloseContextMenu,
                        onClickDetach,
                    )}
                    disabled={disabledForZero}
                    desktop={desktop}
                />
            )}
            {features.status && (
                <React.Fragment>
                    <MenuItem
                        primaryText="Mark as reviewed"
                        leftIcon={<LockIcon />}
                        onClick={compose(
                            onCloseContextMenu,
                            onClickReviewed,
                        )}
                        onTouchTap={compose(
                            onCloseContextMenu,
                            onClickReviewed,
                        )}
                        disabled={disabledForZero}
                        desktop={desktop}
                    />
                    <MenuItem
                        primaryText="Mark as needs review"
                        leftIcon={<UnlockIcon />}
                        onClick={compose(
                            onCloseContextMenu,
                            onClickNeedsReview,
                        )}
                        onTouchTap={compose(
                            onCloseContextMenu,
                            onClickNeedsReview,
                        )}
                        disabled={disabledForZero}
                        desktop={desktop}
                    />
                </React.Fragment>
            )}
        </React.Fragment>
    );
}
