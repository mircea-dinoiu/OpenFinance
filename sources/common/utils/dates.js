// @flow
import moment from 'moment';

export function getStartDate({endDate, include}: {endDate: string, include: string}): string {
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
}

export function formatYMD(date: Date = new Date()): string {
    return moment(date).format('YYYY-MM-DD');
}

export function getInitialEndDate(): string {
    const date = new Date();

    date.setDate(1);
    date.setMonth(date.getMonth() + 1);

    return formatYMD(date);
}