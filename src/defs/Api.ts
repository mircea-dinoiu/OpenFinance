export const Api = {
    transactions: '/api/transactions',
    transactionsDetach: '/api/transactions/detach',
    transactionsSkip: '/api/transactions/skip',
    transactionsUpload: '/api/transactions/upload',
    transactionsSuggestions: {
        categories: '/api/transactions/suggestions/categories',
        descriptions: '/api/transactions/suggestions/descriptions',
    },
    categories: '/api/categories',
    inventories: '/api/inventories',
    moneyLocations: '/api/money-locations',
    reports: {
        cashFlow: '/api/reports/cash-flow',
        summary: '/api/reports/summary',
        balanceByLocation: '/api/reports/balance-by-location',
    },
    currencies: '/api/currencies',
    properties: '/api/properties',
    stocks: '/api/stocks',
    user: {
        list: '/api/users',
        logout: '/api/users/logout',
        login: '/api/users/login',
    },
};
