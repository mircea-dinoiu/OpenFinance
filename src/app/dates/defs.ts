export const CalendarWithoutTime = {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    lastWeek: '[last] dddd',
    nextWeek: 'dddd',
    sameElse: 'YYYY-MM-DD',
};

export enum ShiftDateOption {
    oneDay = '1d',

    oneWeek = '1w',
    twoWeeks = '2w',

    oneMonth = '1m',

    oneYear = '1y',
}

export const ShiftDateOptions: Array<{
    value: ShiftDateOption;
    label: string;
}> = [
    {value: ShiftDateOption.oneDay, label: '1 day'},
    {value: ShiftDateOption.oneWeek, label: '1 week'},
    {value: ShiftDateOption.twoWeeks, label: '2 weeks'},
    {value: ShiftDateOption.oneMonth, label: '1 month'},
    {value: ShiftDateOption.oneYear, label: '1 year'},
];
export const FULL_DATE_FORMAT_TZ = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]';
