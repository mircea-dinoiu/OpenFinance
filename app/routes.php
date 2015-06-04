<?php

Route::get('/', 'HomeController@getIndex');

Route::group(['prefix' => 'user'], function () {
    Route::group(['before' => 'guest'], function () {
        Route::post('login', 'UserController@login');
    });

    Route::group(['before' => 'auth'], function () {
        Route::post('logout', 'UserController@logout');
        Route::get('list', 'UserController@listUsers');
    });
});

Route::group([
    'before' => 'auth'
], function () {
    Route::get('get-currencies', 'CurrencyController@getCurrencies');
});

Route::group([
    'before' => 'auth',
    'prefix' => 'category'
], function () {
    Route::get('list', 'CategoryController@listCategories');
});

Route::group([
    'prefix' => 'expense',
    'before' => 'auth'
], function () {
    Route::get('list', 'ExpenseController@listExpenses');
});