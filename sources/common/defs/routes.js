import config from '../utils/config';

const baseURL = config.baseUrl;

export default {
    expense: {
        list: baseURL + '/expense/list',
        create: baseURL + '/expense/create',
        update: baseURL + '/expense/update',
        destroy: baseURL + '/expense/delete'
    },
    income: {
        list: baseURL + '/income/list',
        create: baseURL + '/income/create',
        update: baseURL + '/income/update',
        destroy: baseURL + '/income/delete'
    },
    report: {
        summary: baseURL + '/report/summary',
        chart: {
            expensesByCategory: baseURL + '/report/chart/expenses-by-category',
            expensesIncomesByUser: baseURL + '/report/chart/expenses-incomes-by-user'
        }
    },
    getCurrencies: baseURL + '/get-currencies',
    user: {
        list: baseURL + '/user/list',
        logout: baseURL + '/user/logout',
        login: baseURL + '/user/login'
    },
    category: {
        list: baseURL + '/category/list',
        create: baseURL + '/category/create',
        update: baseURL + '/category/update',
        destroy: baseURL + '/category/delete'
    },
    ml: {
        list: baseURL + '/money-location/list',
        create: baseURL + '/money-location/create',
        update: baseURL + '/money-location/update'
    },
    mlType: {
        list: baseURL + '/money-location-type/list',
        create: baseURL + '/money-location-type/create',
        update: baseURL + '/money-location-type/update'
    }
}