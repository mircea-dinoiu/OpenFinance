<?php

Route::group([
    'prefix' => 'income',
    'before' => 'auth'
], function () {
    Route::get('list', 'IncomeController@getList');
    Route::post('update', 'IncomeController@postUpdate');
    Route::post('delete', 'IncomeController@postDelete');
    Route::post('create', 'IncomeController@postCreate');
});