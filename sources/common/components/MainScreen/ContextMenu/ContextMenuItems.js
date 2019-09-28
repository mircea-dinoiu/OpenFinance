// @flow
import {objectValuesOfSameType} from 'common/utils/collection';
import * as React from 'react';
import {MenuItem, Divider} from 'material-ui';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import DuplicateIcon from '@material-ui/icons/FileCopy';
import DetachIcon from '@material-ui/icons/ViewAgenda';
import MergeIcon from '@material-ui/icons/MergeType';
import LockIcon from '@material-ui/icons/Lock';
import UnlockIcon from '@material-ui/icons/LockOpen';
import IconArrowDown from '@material-ui/icons/ArrowDownward';
import IconArrowUp from '@material-ui/icons/ArrowUpward';

import IconArchive from '@material-ui/icons/Archive';
import IconUnarchive from '@material-ui/icons/Unarchive';

import compose from 'common/utils/compose';

type TypeOnClick = () => any;

export default function ContextMenuItems({
    onClickEdit,
    onClickDelete,
    onClickDuplicate,
    onClickDetach,
    onClickReviewed,
    onClickNeedsReview,
    onCloseContextMenu,
    onClickDeposit,
    onClickWithdrawal,
    onClickMerge,

    onClickHide,
    onClickUnhide,

    selectedIds,
    desktop = false,
}: {
    onClickEdit: TypeOnClick,
    onClickDelete: TypeOnClick,
    onClickDuplicate: TypeOnClick,
    onClickDetach: TypeOnClick,
    onClickMerge: TypeOnClick,
    onClickReviewed: TypeOnClick,
    onClickNeedsReview: TypeOnClick,
    onCloseContextMenu: TypeOnClick,
    onClickDeposit: TypeOnClick,
    onClickWithdrawal: TypeOnClick,
    onClickHide: TypeOnClick,
    onClickUnhide: TypeOnClick,
    selectedIds: {},
    desktop: boolean,
}) {
    const selectedIdsLength = objectValuesOfSameType(selectedIds).filter(
        Boolean,
    ).length;
    const disabledForZero = selectedIdsLength === 0;
    const disabledForLessThanTwo = selectedIdsLength < 2;

    return (
        <>
            <MenuItem
                primaryText={selectedIdsLength === 1 ? 'Edit' : 'Edit Multiple'}
                leftIcon={<CreateIcon />}
                onClick={compose(
                    onCloseContextMenu,
                    onClickEdit,
                )}
                onTouchTap={compose(
                    onCloseContextMenu,
                    onClickEdit,
                )}
                disabled={disabledForZero}
                desktop={desktop}
            />
            {(
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
            {(
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
            <MenuItem
                primaryText="Merge"
                leftIcon={<MergeIcon />}
                onClick={compose(
                    onCloseContextMenu,
                    onClickMerge,
                )}
                onTouchTap={compose(
                    onCloseContextMenu,
                    onClickMerge,
                )}
                disabled={disabledForLessThanTwo}
                desktop={desktop}
            />
            <Divider />
            {(
                <>
                    <MenuItem
                        primaryText="Change to Posted"
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
                        primaryText="Change to Pending"
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
                </>
            )}
            <Divider />
            <MenuItem
                primaryText="Change to Deposit"
                leftIcon={<IconArrowDown />}
                onClick={compose(
                    onCloseContextMenu,
                    onClickDeposit,
                )}
                onTouchTap={compose(
                    onCloseContextMenu,
                    onClickDeposit,
                )}
                disabled={disabledForZero}
                desktop={desktop}
            />
            <MenuItem
                primaryText="Change to Withdrawal"
                leftIcon={<IconArrowUp />}
                onClick={compose(
                    onCloseContextMenu,
                    onClickWithdrawal,
                )}
                onTouchTap={compose(
                    onCloseContextMenu,
                    onClickWithdrawal,
                )}
                disabled={disabledForZero}
                desktop={desktop}
            />
            <Divider />
            <MenuItem
                primaryText="Archive"
                leftIcon={<IconArchive />}
                onClick={compose(
                    onCloseContextMenu,
                    onClickHide,
                )}
                onTouchTap={compose(
                    onCloseContextMenu,
                    onClickHide,
                )}
                disabled={disabledForZero}
                desktop={desktop}
            />
            <MenuItem
                primaryText="Unarchive"
                leftIcon={<IconUnarchive />}
                onClick={compose(
                    onCloseContextMenu,
                    onClickUnhide,
                )}
                onTouchTap={compose(
                    onCloseContextMenu,
                    onClickUnhide,
                )}
                disabled={disabledForZero}
                desktop={desktop}
            />
        </>
    );
}
