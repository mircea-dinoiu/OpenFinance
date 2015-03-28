<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

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

Route::group(['prefix' => 'currency'], function () {
    Route::get('get-currencies', ['before' => 'auth', 'uses' => 'CurrencyController@getCurrencies']);
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