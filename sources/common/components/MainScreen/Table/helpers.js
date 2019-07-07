// @flow
import type {TypeTransactionModel} from 'common/types';
import {formatYMD} from 'common/utils/dates';
import cssTable from 'common/components/BaseTable/index.pcss';

const today = formatYMD(new Date());

export const getTrClassName = (
    item: TypeTransactionModel,
    {selectedIds},
): string => {
    const classes = [cssTable.notSelectable];

    if (formatYMD(item.created_at) === today) {
        classes.push(cssTable.todayRow);
    }

    if (item.status === 'pending') {
        classes.push(cssTable.pendingRow);
    }

    if (item.hidden) {
        classes.push(cssTable.hiddenRow);
    }

    if (selectedIds[item.id]) {
        classes.push(cssTable.selectedRow);
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
