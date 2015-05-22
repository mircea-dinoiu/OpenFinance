<!DOCTYPE HTML>
<html manifest="" lang="en-US">
<head>
	<meta charset="UTF-8">
	<title>{{ Lang::get('general.application_title') }}</title>
	<style type="text/css">
		@-webkit-keyframes spin {
			from {
				-webkit-transform: rotate(0deg);
				opacity: 0.4;
			}
			50% {
				-webkit-transform: rotate(180deg);
				opacity: 1;
			}
			to {
				-webkit-transform: rotate(360deg);
				opacity: 0.4;
			}
		}

		@-moz-keyframes spin {
			from {
				-moz-transform: rotate(0deg);
				opacity: 0.4;
			}
			50% {
				-moz-transform: rotate(180deg);
				opacity: 1;
			}
			to {
				-moz-transform: rotate(360deg);
				opacity: 0.4;
			}
		}

		@-o-keyframes spin {
			from {
				-o-transform: rotate(0deg);
				opacity: 0.4;
			}
			50% {
				-o-transform: rotate(180deg);
				opacity: 1;
			}
			to {
				-o-transform: rotate(360deg);
				opacity: 0.4;
			}
		}

		@keyframes spin {
			from {
				transform: rotate(0deg);
				opacity: 0.2;
			}
			50% {
				transform: rotate(180deg);
				opacity: 1;
			}
			to {
				transform: rotate(360deg);
				opacity: 0.2;
			}
		}

		#appLoadingIndicator {
			position: absolute;
			height: 100%;
			width: 100%;
			background-color: #FFF;
		}

		#appLoadingIndicator .spinner {
			position: absolute;
			background: #EEE;
			width: 100px;
			height: 100px;
			left: calc(50% - 50px);
			top: calc(50% - 50px);
			border: 10px solid #CCC;
			border-right-color: transparent;
			border-radius: 50%;
			-webkit-animation: spin 1s linear infinite;
			-moz-animation: spin 1s linear infinite;
			-o-animation: spin 1s linear infinite;
			animation: spin 1s linear infinite;
		}
	</style>
	<script>
		var Financial = {
			debug: {{ var_export(Config::get('app.debug')) }},
			baseURL: {{ var_export(Config::get('app.url')) }},
			emailRegExp: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
		};
	</script>
	<!-- The line below must be kept intact for Sencha Command to build your application -->
	<script id="microloader" type="text/javascript" src="{{ URL('mobile/.sencha/app/microloader/development.js') }}"></script>
</head>
<body>
<div id="appLoadingIndicator">
    <div class="spinner"></div>
</div>
</body>
</html>