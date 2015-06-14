<script>
    var Financial = {};

    (function () {
        var baseURL = '{{ Config::get('app.url') }}';

        Financial.data = {};
        Financial.debug = ('{{ var_export(Config::get('app.debug')) }}' === 'true');
        Financial.routes = {
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
            getCurrencies: baseURL + '/get-currencies',
            getReports: baseURL + '/get-reports',
            user: {
                list: baseURL + '/user/list',
                logout: baseURL + '/user/logout',
                login: baseURL + '/user/login'
            },
            category: {
                list: baseURL + '/category/list'
            }
        };
    }());
</script>