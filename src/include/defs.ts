export enum IncludeOption {
    all = 'all',

    weekToDate = 'weekToDate',
    monthToDate = 'monthToDate',
    yearToDate = 'yearToDate',

    untilToday = 'untilToday',
    untilTomorrow = 'untilTomorrow',
    untilNow = 'untilNow',
    untilYesterday = 'untilYesterday',
}

export const IncludeOptions = [
    {
        value: IncludeOption.all,
        label: 'Everything',
    },
    {
        value: IncludeOption.untilTomorrow,
        label: 'Until tomorrow',
    },
    {
        value: IncludeOption.untilToday,
        label: 'Until today',
    },
    {
        value: IncludeOption.untilNow,
        label: 'Until now',
    },
    {
        value: IncludeOption.untilYesterday,
        label: 'Until yesterday',
    },
    {
        value: IncludeOption.weekToDate,
        label: 'Week to Date',
    },
    {
        value: IncludeOption.monthToDate,
        label: 'Month to Date',
    },
    {
        value: IncludeOption.yearToDate,
        label: 'Year to Date',
    },
];
