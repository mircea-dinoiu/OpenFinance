// @flow
import { formatYMD } from 'common/utils/dates';
import moment from 'moment';
import cssTable from 'common/components/BaseTable/index.pcss';

export const getTrClassName = (item, { selectedIds }): string => {
    const classes = [];
    const day = formatYMD;

    if (moment(item.created_at).date() % 2 === 0) {
        classes.push(cssTable.evenRow);
    } else {
        classes.push(cssTable.oddRow);
    }

    if (day(item.created_at) === day(new Date())) {
        classes.push(cssTable.todayRow);
    } else if (day(item.created_at) > day(new Date())) {
        classes.push(cssTable.futureRow);
    }

    if (selectedIds.includes(item.id)) {
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
            onReceiveSelectedIds([item.id]);
            onEdit();
        } else {
            onReceiveSelectedIds([]);
        }
    },
    onClick(event) {
        onChangeContextMenu({ display: false });

        let newSelected;

        if (event.metaKey) {
            if (item.persist !== false) {
                newSelected = selectedIds.includes(item.id)
                    ? selectedIds.filter((id) => id !== item.id)
                    : selectedIds.concat(item.id);
            } else {
                newSelected = selectedIds;
            }
        } else {
            newSelected = item.persist !== false ? [item.id] : [];
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

            if (!selectedIds.includes(item.id)) {
                onReceiveSelectedIds([item.id]);
            }
        }
    },
});
