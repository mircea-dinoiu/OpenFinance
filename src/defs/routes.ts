export const routes = {
    transactions: '/api/transactions',
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
        expensesByLocation: '/api/reports/expenses-by-location',
    },
    currencies: '/api/currencies',
    user: {
        list: '/api/users',
        logout: '/api/users/logout',
        login: '/api/users/login',
    },
};
