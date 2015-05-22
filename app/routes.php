<?php

Route::get('/', 'HomeController@getIndex');

Route::group(['prefix' => 'user'], function () {
    Route::group(['before' => 'guest'], function () {
        Route::post('login', 'UserController@login');
    });

    Route::group(['before' => 'auth'], function () {
        Route::post('logout', 'UserController@logout');
        Route::get('read', 'UserController@read');
    });
});

Route::group([
    'before' => 'auth',
    'prefix' => 'currency'
], function () {
    Route::get('get-currencies', 'CurrencyController@getCurrencies');
});

Route::group([
    'prefix' => 'expense',
    'before' => 'auth'
], function () {
    Route::get('read', 'ExpenseController@read');
    Route::delete('delete/{id}', 'ExpenseController@delete');
    Route::put('update/{id}', 'ExpenseController@update');
    Route::post('create/{id}', 'ExpenseController@create');
});