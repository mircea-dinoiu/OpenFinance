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

Route::get('get-data', ['before' => 'auth', 'uses' => 'HomeController@getData']);

Route::group(['prefix' => 'user'], function () {
    Route::post('login', ['before' => 'guest', 'uses' => 'UserController@login']);
    Route::post('logout', ['before' => 'auth', 'uses' => 'UserController@logout']);
});

Route::group(['prefix' => 'currency'], function () {
    Route::get('get-currencies', ['before' => 'auth', 'uses' => 'CurrencyController@getCurrencies']);
});

Route::group([
    'prefix' => 'expense',
    'before' => 'auth'
], function () {
    Route::get('list', 'ExpenseController@listExpenses');
    Route::delete('{id}', 'ExpenseController@delete');
});