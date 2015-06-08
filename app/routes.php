<?php

Route::get('/', 'HomeController@getIndex');

Route::group(['prefix' => 'user'], function () {
    Route::group(['before' => 'guest'], function () {
        Route::post('login', 'UserController@login');
    });

    Route::group(['before' => 'auth'], function () {
        Route::post('logout', 'UserController@logout');
        Route::get('list', 'UserController@getList');
    });
});

Route::group([
    'before' => 'auth'
], function () {
    Route::get('get-currencies', 'CurrencyController@getCurrencies');
    Route::get('get-reports', 'ReportController@getReports');
});

Route::group([
    'before' => 'auth',
    'prefix' => 'category'
], function () {
    Route::get('list', 'CategoryController@getList');
});

Route::group([
    'prefix' => 'expense',
    'before' => 'auth'
], function () {
    Route::get('list', 'ExpenseController@getList');
    Route::post('update', 'ExpenseController@postUpdate');
    Route::post('delete', 'ExpenseController@postDelete');
    Route::post('create', 'ExpenseController@postCreate');
});

Route::group([
    'prefix' => 'income',
    'before' => 'auth'
], function () {
    Route::get('list', 'IncomeController@getList');
    Route::post('update', 'IncomeController@postUpdate');
    Route::post('delete', 'IncomeController@postDelete');
    Route::post('create', 'IncomeController@postCreate');
});