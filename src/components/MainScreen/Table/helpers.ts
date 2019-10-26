import {TypeTransactionModel} from 'types';
import {formatYMD} from 'utils/dates';
import {Classes} from 'components/BaseTable';
import {TypeAnchoredContextMenuDisplayProps} from 'components/MainScreen/ContextMenu/AnchoredContextMenu';

const today = formatYMD(new Date());

export const getTrClassName = (
    item: TypeTransactionModel,
    {selectedIds},
): string => {
    const classes = [Classes.notSelectable];

    if (formatYMD(item.created_at) === today) {
        classes.push(Classes.todayRow);
    }

    if (item.sum < 0) {
        classes.push(Classes.withdrawRow);
    }

    if (item.sum > 0) {
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
    item: TypeTransactionModel;
    onChangeContextMenu: (
        props: Partial<TypeAnchoredContextMenuDisplayProps>,
    ) => void;
    onReceiveSelectedIds: (ids: {[key: number]: boolean}) => void;
    onEdit: () => void;
    selectedIds: {
        [key: number]: boolean;
    };
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
    onClick(event: MouseEvent) {
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
    onContextMenu: (event: MouseEvent) => {
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
