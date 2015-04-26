<html>
<head>
    <title>{{ \Lang::get('general.application_title') }}</title>

    {{ HTML::style('desktop/bower_components/bootstrap/dist/css/bootstrap.min.css') }}
    {{ HTML::style('desktop/bower_components/bootstrap/dist/css/bootstrap-theme.min.css') }}
</head>
<body>
    <main>
        Loading..
    </main>
    {{ HTML::script('desktop/bower_components/jquery/dist/jquery.min.js') }}
    {{ HTML::script('desktop/bower_components/jquery-pjax/jquery.pjax.js') }}
    {{ HTML::script('desktop/bower_components/bootstrap/dist/js/bootstrap.min.js') }}

    <script>
        $(function () {
            $.pjax({
                url: location.href,
                container: 'main'
            });
        });
    </script>
</body>
</html>