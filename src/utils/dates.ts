import {IncludeOption, ShiftDateOption} from 'defs';
import {QueryParam} from 'defs/url';

import {endOfDayToISOString} from 'js/utils/dates';
import moment from 'moment';
import {useQueryParamState} from 'utils/url';

export const getStartDate = ({endDate, include}: {endDate: string; include: IncludeOption}): string => {
    let date: Date | null = moment(endDate).toDate();

    date.setHours(0, 0, 0, 0);

    switch (include) {
        case IncludeOption.lastYear:
            date.setFullYear(date.getFullYear() - 1);
            break;
        case IncludeOption.currentYear:
            date = new Date(date.getFullYear(), 0, 1);
            break;
        case IncludeOption.previousYear:
            date = new Date(date.getFullYear() - 1, 0, 1);
            break;
        case IncludeOption.nextYear:
            date = new Date(date.getFullYear() + 1, 0, 1);
            break;
        case IncludeOption.lastMonth:
            date.setMonth(date.getMonth() - 1);
            break;
        case IncludeOption.lastWeek:
            date.setDate(date.getDate() - 7);
            break;
        case IncludeOption.lastDay:
            date.setDate(date.getDate() - 1);
            break;
        default:
            date = null;
            break;
    }

    return date ? moment(date).toISOString() : '';
};

const getMomentArgsForDateShift = (option: ShiftDateOption, times = 1) => {
    const one = 1;

    switch (option) {
        case ShiftDateOption.oneDay:
            return [one * Number(times), 'day'];
        case ShiftDateOption.oneWeek:
            return [one * Number(times), 'week'];
        case ShiftDateOption.twoWeeks:
            return [2 * Number(times), 'week'];
        case ShiftDateOption.oneMonth:
            return [one * Number(times), 'month'];
        case ShiftDateOption.oneYear:
            return [one * Number(times), 'year'];
    }

    throw new Error(`${option} is not specified in ShiftDateOptions`);
};

export const shiftDateForward = (date: string | Date, by: ShiftDateOption, times?: number) =>
    moment(date)
        .add(...getMomentArgsForDateShift(by, times))
        .toDate();

export const shiftDateBack = (date: string | Date, by: ShiftDateOption, times?: number) =>
    moment(date)
        .subtract(...getMomentArgsForDateShift(by, times))
        .toDate();

export const getInitialEndDate = (): string => {
    const date = new Date();

    date.setMonth(date.getMonth() + 1);
    date.setDate(0);

    return endOfDayToISOString(date);
};

export const formatYMD = (date: Date | number = new Date()) => moment(date).format('YYYY-MM-DD');

export const useEndDate = () => {
    return useQueryParamState(QueryParam.endDate, getInitialEndDate());
};

export const useEndDateIncrement = () => {
    return useQueryParamState<ShiftDateOption>('endDateIncrement', ShiftDateOption.oneMonth);
};
