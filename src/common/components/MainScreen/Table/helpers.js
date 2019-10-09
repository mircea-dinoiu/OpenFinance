// @ flow
import type {TypeTransactionModel} from 'common/types';
import {formatYMD} from 'common/utils/dates';
import {Classes} from 'common/components/BaseTable';
import type {TypeAnchoredContextMenuDisplayProps} from 'common/components/MainScreen/ContextMenu/AnchoredContextMenu';

const today = formatYMD(new Date());

export const getTrClassName = (
    item: TypeTransactionModel,
    {selectedIds},
): string => {
    const classes = [Classes.notSelectable];

    if (formatYMD(item.created_at) === today) {
        classes.push(Classes.todayRow);
    }

    if (item.type === 'withdrawal') {
        classes.push(Classes.withdrawRow);
    }

    if (item.type === 'deposit') {
        classes.push(Classes.depositRow);
    }

    if (item.status === 'pending') {
        classes.push(Classes.pendingRow);
    }

    if (item.hidden) {
        classes.push(Classes.hiddenRow);
    }

    if (selectedIds[item.id]) {
        classes.push(Classes.selectedRow);
    }

    return classes.join(' ');
};

export const getTrProps = ({
    onReceiveSelectedIds,
    onEdit,
    selectedIds,
    onChangeContextMenu,
    item,
}: {
    item: TypeTransactionModel,
    onChangeContextMenu: ($Shape<TypeAnchoredContextMenuDisplayProps>) => void,
    onReceiveSelectedIds: ({
        [number]: boolean,
        ...,
    }) => void,
    onEdit: () => void,
    selectedIds: {
        [number]: boolean,
    },
}) => ({
    className: getTrClassName(item, {selectedIds}),
    onDoubleClick: () => {
        if (item.persist !== false) {
            onReceiveSelectedIds({[item.id]: true});
            onEdit();
        } else {
            onReceiveSelectedIds({});
        }
    },
    onClick(event: SyntheticMouseEvent<any>) {
        onChangeContextMenu({display: false});

        let newSelected;

        if (event.metaKey || event.ctrlKey) {
            if (item.persist !== false) {
                newSelected = {...selectedIds};

                newSelected[item.id] = !selectedIds[item.id];
            } else {
                return;
            }
        } else {
            newSelected = item.persist !== false ? {[item.id]: true} : {};
        }

        onReceiveSelectedIds(newSelected);
    },
    onContextMenu: (event: SyntheticMouseEvent<any>) => {
        event.preventDefault();

        if (item.persist !== false) {
            onChangeContextMenu({
                display: true,
                left: event.clientX,
                top: event.clientY,
            });

            if (!selectedIds[item.id]) {
                onReceiveSelectedIds({[item.id]: true});
            }
        }
    },
});
