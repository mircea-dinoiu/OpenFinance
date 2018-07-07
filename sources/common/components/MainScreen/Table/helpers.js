// @flow
import { formatYMD } from 'common/utils/dates';
import moment from 'moment';
import cssTable from 'common/components/FinancialTable/index.pcss';

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
    onDoubleClick,
    selectedIds,
    item,
}) => {
    const onClick = (event) => {
        let newSelected;

        if (event.metaKey) {
            newSelected = selectedIds.includes(item.id)
                ? selectedIds.filter((id) => id !== item.id)
                : selectedIds.concat(item.id);
        } else {
            newSelected = [item.id];
        }

        onReceiveSelectedIds(newSelected);

        return newSelected;
    };

    return {
        className: getTrClassName(item, { selectedIds }),
        onDoubleClick: () =>
            item.persist !== false ? onDoubleClick(item) : null,
        onClick,
        onContextMenu: (event) => {
            const selected = onClick(event);
        },
    };
};
