// @flow
import cssTable from 'common/components/BaseTable/index.pcss';

export const getTrClassName = (item, { selectedIds }): string => {
    const classes = [cssTable.notSelectable];

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
}) => ({
    className: getTrClassName(item, { selectedIds }),
    onDoubleClick: () => {
        if (item.persist !== false) {
            onReceiveSelectedIds({ [item.id]: true });
            onEdit();
        } else {
            onReceiveSelectedIds({});
        }
    },
    onClick(event) {
        onChangeContextMenu({ display: false });

        let newSelected;

        if (event.metaKey || event.ctrlKey) {
            if (item.persist !== false) {
                newSelected = { ...selectedIds };

                newSelected[item.id] = !selectedIds[item.id];
            } else {
                return;
            }
        } else {
            newSelected = item.persist !== false ? { [item.id]: true } : {};
        }

        onReceiveSelectedIds(newSelected);
    },
    onContextMenu: (event) => {
        event.preventDefault();

        if (item.persist !== false) {
            onChangeContextMenu({
                display: true,
                left: event.clientX,
                top: event.clientY,
            });

            if (!selectedIds[item.id]) {
                onReceiveSelectedIds({ [item.id]: true });
            }
        }
    },
});
