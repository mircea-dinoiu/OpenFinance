<script>
    var Financial = {};

    (function () {
        var baseURL = '{{ $baseUrl }}';

        String.prototype.format = function () {
            return Ext.String.format.apply(Ext.String, [this.toString()].concat(Array.from(arguments)))
        };

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
                list: baseURL + '/category/list',
                create: baseURL + '/category/create',
                update: baseURL + '/category/update',
                destroy: baseURL + '/category/delete'
            },
            moneyLocation: {
                list: baseURL + '/money-location/list',
                create: baseURL + '/money-location/create',
                update: baseURL + '/money-location/update'
            }
        };
        Financial.initialValues = {
            getStartDate: function () {
                var date = new Date();

                if (date.getDate() < 2) {
                    date.setMonth(date.getMonth() - 1);
                }

                date.setDate(2);

                return date;
            },
            getEndDate: function () {
                var date = new Date();

                if (date.getDate() < 2) {
                    date.setMonth(date.getMonth() - 1);
                }

                date.setMonth(date.getMonth() + 1);
                date.setDate(1);

                return date;
            }
        };
    }());
</script>