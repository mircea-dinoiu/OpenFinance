<html>
<head>
    <title>{{ \Lang::get('general.application_title') }}</title>
</head>
<body>
    <main>
        {{ $content }}
    </main>
    {{ HTML::script('desktop/bower_components/jquery/dist/jquery.min.js') }}
    {{ HTML::script('desktop/bower_components/jquery-pjax/jquery.pjax.js') }}
</body>
</html>