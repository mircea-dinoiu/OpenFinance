import {formatYMD} from 'common/utils/dates';
import moment from 'moment/moment';

export const getTrClassName = (item): string => {
    const classes = [];
    const day = formatYMD;

    if (moment(item.created_at).date() % 2 === 0) {
        classes.push('msl__even-row');
    } else {
        classes.push('msl__odd-row');
    }

    if (day(item.created_at) === day(new Date())) {
        classes.push('msl__today-row');
    } else if (day(item.created_at) > day(new Date())) {
        classes.push('msl__future-row');
    }

    return classes.join(' ');
};

export const getTrProps = (state, {original: item}) => {
    return {
        className: getTrClassName(item),
        onDoubleClick: () => item.persist !== false ? alert(JSON.stringify(item)) : null,
    };
};