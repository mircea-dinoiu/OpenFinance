const RepeatOption = {
    DAY: 'd',
    WEEK: 'w',
    MONTH: 'm',
    YEAR: 'y',
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
    },
    apis: {},
};
