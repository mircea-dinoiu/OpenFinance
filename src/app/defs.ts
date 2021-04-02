

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

export const Timers = {
    SEARCH_DEBOUNCE: 250,
};

export enum StorageKey {
    privacyToggle = 'privacyToggle',
    paymentDialogAddlCashFlow = 'paymentDialogAddlCashFlow',
    paymentDialogSkipPayments = 'paymentDialogSkipPayments',
    paymentDialogAprThreshold = 'paymentDialogAprThreshold',
}
