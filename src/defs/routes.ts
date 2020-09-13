export const routes = {
    transactions: '/api/transactions',
    transactionsDetach: '/api/transactions/detach',
    transactionsSkip: '/api/transactions/skip',
    transactionsUpload: '/api/transactions/upload',
    transactionsSuggestions: {
        categories: '/api/transactions/suggestions/categories',
        descriptions: '/api/transactions/suggestions/descriptions',
    },
    categories: '/api/categories',
    moneyLocations: '/api/money-locations',
    moneyLocationTypes: '/api/money-location-types',
    reports: {
        summary: '/api/reports/summary',
        balanceByLocation: '/api/reports/balance-by-location',
    },
    currencies: '/api/currencies',
    stocks: '/api/stocks',
    user: {
        list: '/api/users',
        logout: '/api/users/logout',
        login: '/api/users/login',
    },
};
