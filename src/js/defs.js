const RepeatOption = {
    DAILY: 'd',
    WEEKLY: 'w',
    WEEK_2: '2w',
    MONTHLY: 'm',
    MONTHLY_TWICE: 'm/2',
    MONTH_2: '2m',
    MONTH_3: '3m',
    YEARLY: 'y',
};

module.exports = {
    FULL_DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss.SSS',
    FULL_DATE_FORMAT_TZ: 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',
    PERC_STEP: 5,
    PERC_MIN: 0,
    PERC_MAX: 100,
    RepeatOption,
    paths: {
        home: '/',
        dashboard: '/dashboard',
        transactions: '/transactions',
        categories: '/categories',
        accounts: '/accounts',
        accountTypes: '/account-types',
        login: '/login',
        currencies: '/currencies',
    },
    apis: {},
};
