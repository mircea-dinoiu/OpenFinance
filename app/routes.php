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
    Route::post('login', ['before' => 'guest', 'uses' => 'UserController@login']);
    Route::post('logout', ['before' => 'auth', 'uses' => 'UserController@logout']);
    Route::get('read', ['before' => 'auth', 'uses' => 'UserController@read']);
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