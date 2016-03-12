<?php

Route::group([
    'before' => 'auth',
    'prefix' => 'category'
], function () {
    Route::get('list', 'CategoryController@getList');
    Route::post('update', 'CategoryController@postUpdate');
    Route::post('create', 'CategoryController@postCreate');
    Route::post('delete', 'CategoryController@postDelete');
});