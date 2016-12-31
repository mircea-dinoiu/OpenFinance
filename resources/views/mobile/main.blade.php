<!DOCTYPE HTML>
<html
		manifest=""
		lang="en-US"
		data-base-url="{{ $baseUrl }}"
		data-debug="{{var_export(\Config::get('app.debug')) }}"
>
<head>
	<meta charset="UTF-8">
</head>
<body>
<script src="{!! $baseUrl !!}/dist/bundles/mobile.js"></script>
</body>
</html>