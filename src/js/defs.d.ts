export enum RepeatOption {
    DAILY = 'd',
    WEEKLY = 'w',
    WEEK_2 = '2w',
    MONTHLY = 'm',
    MONTH_2 = '2m',
    MONTH_3 = '3m',
    YEARLY = 'y',
}

export const paths: {
    home: string;
    transactions: string;
    transactionsSummary: string;
    transactionsList: string;
    login: string;
    categories: string;
    accounts: string;
    accountTypes: string;
};

export const PERC_MAX: number;
export const PERC_STEP: number;
