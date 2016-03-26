<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

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
});

require_once('routes/expense.php');
require_once('routes/income.php');
require_once('routes/category.php');
require_once('routes/money-location.php');
require_once('routes/ml-type.php');