<?php

Route::get('/', 'HomeController@getIndex');

Route::group(['prefix' => 'user'], function () {
    Route::group(['before' => 'guest'], function () {
        Route::post('login', 'UserController@postLogin');
    });

    Route::group(['before' => 'auth'], function () {
        Route::post('logout', 'UserController@postLogout');
        Route::get('list', 'UserController@getList');
    });
});

Route::group([
    'before' => 'auth'
], function () {
    Route::get('get-currencies', 'CurrencyController@getCurrencies');
    Route::get('get-reports', 'ReportController@getReports');
});

require_once('routes/expense.php');
require_once('routes/income.php');
require_once('routes/category.php');

