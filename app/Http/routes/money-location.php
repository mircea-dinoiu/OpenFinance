<?php

Route::group([
    'before' => 'auth',
    'prefix' => 'money-location'
], function () {
    Route::get('list', 'MoneyLocationController@getList');
    Route::post('update', 'MoneyLocationController@postUpdate');
    Route::post('create', 'MoneyLocationController@postCreate');
});