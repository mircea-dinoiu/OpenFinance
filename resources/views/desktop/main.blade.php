<!DOCTYPE HTML>
<html manifest="">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ Lang::get('general.application_title') }}</title>

    @include('scripts.setup')

    <link rel="icon"
          type="image/png"
          href="{!! url(sprintf('resources/img/icon/%s.png', Config::get('app.debug') ? 'page_gear' : 'money')) !!}">

    @if (Config::get('app.debug'))
        {{--*/ $theme = 'triton' /*--}}
        <link rel="stylesheet" href="{{ url( "ext/build/classic/theme-$theme/resources/theme-$theme-all-debug.css" ) }}">
        <link rel="stylesheet" href="{{ url( 'ext/build/packages/charts/classic/classic/resources/charts-all-debug.css' ) }}">
    @endif
    <link rel="stylesheet" href="{{ url( 'resources/css/extra.css?' . @filemtime(app_path('../public/desktop/resources/css/extra.css' ))) }}">

    {!! $bootstrapScript !!}
</head>
<body></body>
</html>