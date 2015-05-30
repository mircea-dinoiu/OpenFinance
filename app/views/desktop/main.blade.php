<!DOCTYPE HTML>
<html manifest="">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

    <title>{{ Lang::get('general.application_title') }}</title>

    <script>
        var Financial = {
            data: {},
            debug: {{ var_export(Config::get('app.debug')) }},
            baseURL: {{ var_export(Config::get('app.url')) }}
        };
    </script>

    {{ HTML::style('desktop/ext/packages/ext-theme-neptune/build/resources/ext-theme-neptune-all-debug.css')}}
    {{ HTML::style('desktop/resources/css/icon.css')}}

    {{ $bootstrapScript }}

    <style>
        .x-mask {
            border: none !important;
        }
    </style>
</head>
<body></body>
</html>