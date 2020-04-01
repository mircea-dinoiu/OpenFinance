export const Sizes = {
    HEADER_SIZE: '48px',
};

export enum ShiftDateOption {
    oneDay,

    oneWeek,
    twoWeeks,

    oneMonth,

    oneYear,
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

export enum TransactionStatus {
    draft = 'draft',
    pending = 'pending',
    finished = 'finished',
}

export enum IncludeOption {
    all,

    lastYear,
    currentYear,
    previousYear,
    nextYear,

    lastMonth,

    lastWeek,

    lastDay,

    untilToday,
    untilTomorrow,
    untilNow,
    untilYesterday,
}
