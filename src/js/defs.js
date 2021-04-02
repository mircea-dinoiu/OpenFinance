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
        dashboard: '/p/:id/dashboard/:tab?',
        transactions: '/p/:id/transactions',
        login: '/login',
    },
    apis: {},
};
