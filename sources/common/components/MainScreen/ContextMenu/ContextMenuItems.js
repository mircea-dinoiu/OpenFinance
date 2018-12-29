// @flow
import React from 'react';
import { MenuItem, Divider } from 'material-ui';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import DuplicateIcon from '@material-ui/icons/FileCopy';
import DetachIcon from '@material-ui/icons/ViewAgenda';
import LockIcon from '@material-ui/icons/Lock';
import UnlockIcon from '@material-ui/icons/LockOpen';
import IconArrowDown from '@material-ui/icons/ArrowDownward';
import IconArrowUp from '@material-ui/icons/ArrowUpward';

import IconStar from '@material-ui/icons/Star';
import IconStarBorder from '@material-ui/icons/StarBorder';

import IconHide from '@material-ui/icons/FlipToBack';
import IconUnhide from '@material-ui/icons/FlipToFront';

import compose from 'common/utils/compose';

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

    onClickAddFavorite,
    onClickRemoveFavorite,

    onClickHide,
    onClickUnhide,

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
    selectedIds: {},
    features: TypeMainScreenFeatures,
    desktop: boolean,
}) {
    const selectedIdsLength = Object.values(selectedIds).filter(Boolean).length;
    const disabledForZero = selectedIdsLength === 0;

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
            <Divider />
            {features.status && (
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
                primaryText="Add to Favorites"
                leftIcon={<IconStar />}
                onClick={compose(
                    onCloseContextMenu,
                    onClickAddFavorite,
                )}
                onTouchTap={compose(
                    onCloseContextMenu,
                    onClickAddFavorite,
                )}
                disabled={disabledForZero}
                desktop={desktop}
            />
            <MenuItem
                primaryText="Remove from Favorites"
                leftIcon={<IconStarBorder />}
                onClick={compose(
                    onCloseContextMenu,
                    onClickRemoveFavorite,
                )}
                onTouchTap={compose(
                    onCloseContextMenu,
                    onClickRemoveFavorite,
                )}
                disabled={disabledForZero}
                desktop={desktop}
            />
            <Divider />
            <MenuItem
                primaryText="Hide"
                leftIcon={<IconHide />}
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
                primaryText="Unhide"
                leftIcon={<IconUnhide />}
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
