import * as React from 'react';
import {Divider, MenuItem, ListItemIcon, ListItemText, SvgIconTypeMap} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import DuplicateIcon from '@material-ui/icons/FileCopy';
import DetachIcon from '@material-ui/icons/ViewAgenda';
import IconSkip from '@material-ui/icons/SkipNext';
import MergeIcon from '@material-ui/icons/MergeType';
import LockIcon from '@material-ui/icons/Lock';
import IconDrafts from '@material-ui/icons/Drafts';
import UnlockIcon from '@material-ui/icons/LockOpen';

import IconArchive from '@material-ui/icons/Archive';
import IconUnarchive from '@material-ui/icons/Unarchive';
import {copyText} from 'utils/clipboardService';

type TypeOnClick = () => any;

export type TypeContextMenuItemsProps = {
    onClickEdit: TypeOnClick;
    onClickDelete: TypeOnClick;
    onClickDuplicate: TypeOnClick;
    onClickDetach: TypeOnClick;
    onClickSkip: TypeOnClick;
    onClickMerge: TypeOnClick;
    onClickDraft: TypeOnClick;
    onClickReviewed: TypeOnClick;
    onClickNeedsReview: TypeOnClick;
    onCloseContextMenu: TypeOnClick;
    onClickHide: TypeOnClick;
    onClickUnhide: TypeOnClick;
    selectedIds: {};
};

export function ContextMenuItems({
    onClickEdit,
    onClickDelete,
    onClickDuplicate,
    onClickDetach,
    onClickSkip,

    onClickDraft,
    onClickReviewed,
    onClickNeedsReview,

    onCloseContextMenu,
    onClickMerge,

    onClickHide,
    onClickUnhide,

    selectedIds,
}: TypeContextMenuItemsProps) {
    const selectedIdsLength = Object.values(selectedIds).filter(Boolean).length;
    const disabledForZero = selectedIdsLength === 0;
    const disabledForLessThanTwo = selectedIdsLength < 2;
    const disabledForAllButOne = selectedIdsLength > 1;

    return (
        <>
            {[
                {
                    onClick: onClickEdit,
                    disabled: disabledForZero,
                    icon: CreateIcon,
                    text: selectedIdsLength === 1 ? 'Edit' : 'Edit Multiple',
                },
                {
                    onClick: onClickDuplicate,
                    disabled: disabledForZero,
                    icon: DuplicateIcon,
                    text: 'Duplicate',
                },
                {
                    onClick: onClickDelete,
                    disabled: disabledForZero,
                    icon: DeleteIcon,
                    text: 'Delete',
                },
                {
                    onClick: () => {
                        copyText(selectedIds[0]);
                    },
                    disabled: disabledForAllButOne,
                    icon: FingerprintIcon,
                    text: 'Copy ID',
                },
                <Divider />,
                {
                    onClick: onClickDetach,
                    disabled: disabledForZero,
                    icon: DetachIcon,
                    text: 'Detach',
                },
                {
                    onClick: onClickSkip,
                    disabled: disabledForZero,
                    icon: IconSkip,
                    text: 'Skip',
                },
                {
                    onClick: onClickMerge,
                    disabled: disabledForLessThanTwo,
                    icon: MergeIcon,
                    text: 'Merge',
                },
                <Divider />,
                {
                    onClick: onClickDraft,
                    disabled: disabledForZero,
                    icon: IconDrafts,
                    text: 'Change to Draft',
                },
                {
                    onClick: onClickReviewed,
                    disabled: disabledForZero,
                    icon: LockIcon,
                    text: 'Change to Posted',
                },
                {
                    onClick: onClickNeedsReview,
                    disabled: disabledForZero,
                    icon: UnlockIcon,
                    text: 'Change to Pending',
                },
                <Divider />,
                {
                    onClick: onClickHide,
                    disabled: disabledForZero,
                    icon: IconArchive,
                    text: 'Archive',
                },
                {
                    onClick: onClickUnhide,
                    disabled: disabledForZero,
                    icon: IconUnarchive,
                    text: 'Unarchive',
                },
            ].map((opt, i) => {
                if (React.isValidElement(opt)) {
                    return opt;
                }

                const {onClick, disabled, icon, text} = opt as {
                    onClick: () => unknown;
                    disabled: boolean;
                    icon: React.ComponentType<SvgIconTypeMap['props']>;
                    text: string;
                };

                return React.isValidElement(opt) ? (
                    opt
                ) : (
                    <MenuItem
                        key={i}
                        onClick={() => {
                            onCloseContextMenu();
                            onClick();
                        }}
                        disabled={disabled}
                    >
                        <ListItemIcon>
                            {React.createElement(icon, {
                                fontSize: 'small',
                            })}
                        </ListItemIcon>
                        <ListItemText>{text}</ListItemText>
                    </MenuItem>
                );
            })}
        </>
    );
}
