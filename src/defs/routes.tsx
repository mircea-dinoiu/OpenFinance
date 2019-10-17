// @flow
export default {
    transactions: '/api/transactions',
    expense: {
        list: '/expense/list',
        create: '/expense/create',
        update: '/expense/update',
        destroy: '/expense/delete',
    },
    report: {
        summary: '/api/reports/summary',
        balanceByLocation: '/api/reports/balance-by-location',
    },
    getCurrencies: '/get-currencies',
    user: {
        list: '/user/list',
        logout: '/user/logout',
        login: '/user/login',
    },
    category: {
        list: '/category/list',
        create: '/category/create',
        update: '/category/update',
        destroy: '/category/delete',
    },
    ml: {
        list: '/money-location/list',
        create: '/money-location/create',
        update: '/money-location/update',
    },
    mlType: {
        list: '/money-location-type/list',
        create: '/money-location-type/create',
        update: '/money-location-type/update',
    },
    suggestion: {
        expense: {
            categories: '/suggestion/expense/categories',
            descriptions: '/suggestion/expense/descriptions',
        },
    },
};
