<!DOCTYPE HTML>
<html manifest="">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

    <title>{{ Lang::get('general.application_title') }}</title>

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

    <link rel="icon" type="image/png" href="{{ url('desktop/resources/img/icon/money.png') }}"/>

    {{--*/ $theme = 'neptune' /*--}}
    {{ HTML::style("desktop/ext/packages/ext-theme-$theme/build/resources/ext-theme-$theme-all-debug.css")}}
    {{ HTML::style('desktop/resources/css/extra.css?' . filemtime(app_path('../public/desktop/resources/css/extra.css'))) }}

    {{ $bootstrapScript }}

    <style>
        .x-mask {
            border: none !important;
        }
    </style>
</head>
<body></body>
</html>