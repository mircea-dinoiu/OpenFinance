// @flow
import moment from 'moment';

export const formatYMD = (date: Date = new Date()): string =>
    moment(date).format('YYYY-MM-DD');

export const getStartDate = ({
    endDate,
    include,
}: {
    endDate: string,
    include: string,
}): string => {
    let date = moment(endDate).toDate();

    date.setHours(0);
    date.setMinutes(0);
    date.setMilliseconds(0);

    switch (include) {
        case 'ly':
            date.setYear(date.getFullYear() - 1);
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

    return date ? formatYMD(date) : '';
};

const getMomentArgsForDateShift = (option) => {
    switch (option) {
        case 'd':
            return [1, 'day'];
        case 'w':
            return [1, 'week'];
        case '2w':
            return [2, 'week'];
        case 'm':
            return [1, 'month'];
    }

    throw new Error(`${option} is not specified in ShiftDateOptions`);
};

export const shiftDateForward = (date, by) =>
    moment(date)
        .add(...getMomentArgsForDateShift(by))
        .toDate();

export const shiftDateBack = (date, by) =>
    moment(date)
        .subtract(...getMomentArgsForDateShift(by))
        .toDate();

export const getInitialEndDate = (): string => {
    const date = new Date();

    date.setDate(1);
    date.setMonth(date.getMonth() + 1);

    return formatYMD(date);
};
