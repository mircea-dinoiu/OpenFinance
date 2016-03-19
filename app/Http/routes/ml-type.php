<?php

Route::group([
    'before' => 'auth',
    'prefix' => 'money-location-type'
], function () {
    Route::get('list', 'MLTypeController@getList');
    Route::post('update', 'MLTypeController@postUpdate');
    Route::post('create', 'MLTypeController@postCreate');
});