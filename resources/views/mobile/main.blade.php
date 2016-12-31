<!DOCTYPE HTML>
<html manifest="" lang="en-US">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

	<meta name="financial_base-url" content="{{ $baseUrl }}">
	<meta name="financial_debug" content="{{var_export(\Config::get('app.debug')) }}">
	<meta name="financial_csrf-token" content="{{ csrf_token() }}">

	<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
</head>
<body>
<div id="root"></div>
<script src="{!! $baseUrl !!}/dist/bundles/mobile.js"></script>
</body>
</html>