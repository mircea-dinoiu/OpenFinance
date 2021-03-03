import {RepeatOption} from 'js/defs';

export const locales = {
    stockTypes: {
        custom: 'Custom',
        mf: 'Mutual Funds',
        etf: 'ETFs & Closed End Funds',
        stock: 'Equities',
        crypto: 'Cryptocurrency',
    },
    mdash: '—',
    apr: 'APR',
    aprThreshold: 'APR Threshold for Early Payments',
    repeatOptions: {
        [RepeatOption.DAY]: 'Day(s)',
        [RepeatOption.WEEK]: 'Week(s)',
        [RepeatOption.MONTH]: 'Month(s)',
        [RepeatOption.YEAR]: 'Year(s)',
    },
    dashboardTabs: ['Banking', 'Investing', 'Properties', 'User Reports', 'Category Reports'],
    nothingToSeeHereYet: 'Nothing to see here yet.',
};
