<!DOCTYPE HTML>
<html manifest="">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

    <title>{{ Lang::get('general.application_title') }}</title>

    @include('scripts.setup')

    <link rel="icon"
          type="image/png"
          href="{{ url(sprintf('desktop/resources/img/icon/%s.png', Config::get('app.debug') ? 'page_gear' : 'money')) }}"/>

    {{--*/ $theme = 'neptune' /*--}}
    {{ HTML::style("desktop/ext/packages/ext-theme-$theme/build/resources/ext-theme-$theme-all-debug.css")}}
    {{ HTML::style('desktop/resources/css/icon.css?' . filemtime(app_path('../public/desktop/resources/css/icon.css'))) }}
    {{ HTML::style('desktop/resources/css/extra.css?' . filemtime(app_path('../public/desktop/resources/css/extra.css'))) }}

    {{ $bootstrapScript }}
</head>
<body></body>
</html>