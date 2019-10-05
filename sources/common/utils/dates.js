// @flow weak
import type {TypeShiftDateOption} from 'common/types';
import moment from 'moment';

import {endOfDayToISOString} from 'shared/utils/dates';

export const getStartDate = ({
    endDate,
    include,
}: {
    endDate: string,
    include: string,
}): string => {
    let date = moment(endDate).toDate();

    date.setHours(0, 0, 0, 0);

    switch (include) {
        case 'ly':
            date.setYear(date.getFullYear() - 1);
            break;
        case 'current-year':
            date = new Date(date.getFullYear(), 0, 1);
            break;
        case 'previous-year':
            date = new Date(date.getFullYear() - 1, 0, 1);
            break;
        case 'next-year':
            date = new Date(date.getFullYear() + 1, 0, 1);
            break;
        case 'lm':
            date.setMonth(date.getMonth() - 1);
            break;
        case 'lw':
            date.setDate(date.getDate() - 7);
            break;
        case 'ld':
            date.setDate(date.getDate() - 1);
            break;
        default:
            date = null;
            break;
    }

    return date ? moment(date).toISOString() : '';
};

const getMomentArgsForDateShift = (option: TypeShiftDateOption, times = 1) => {
    const one = 1;

    switch (option) {
        case 'd':
            return [one * Number(times), 'day'];
        case 'w':
            return [one * Number(times), 'week'];
        case '2w':
            return [2 * Number(times), 'week'];
        case 'm':
            return [one * Number(times), 'month'];
        case '1y':
            return [one * Number(times), 'year'];
    }

    throw new Error(`${option} is not specified in ShiftDateOptions`);
};

export const shiftDateForward = (
    date: string | Date,
    by: TypeShiftDateOption,
    times?: number,
) =>
    moment(date)
        .add(...getMomentArgsForDateShift(by, times))
        .toDate();

export const shiftDateBack = (
    date: string | Date,
    by: TypeShiftDateOption,
    times?: number,
) =>
    moment(date)
        .subtract(...getMomentArgsForDateShift(by, times))
        .toDate();

export const getInitialEndDate = (): string => {
    const date = new Date();

    date.setDate(1);
    date.setMonth(date.getMonth() + 1);

    return endOfDayToISOString(date);
};

export const formatYMD = (date: Date = new Date()) =>
    moment(date).format('YYYY-MM-DD');
