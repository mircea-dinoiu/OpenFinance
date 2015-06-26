<?php

Route::group([
    'prefix' => 'expense',
    'before' => 'auth'
], function () {
    Route::get('list', 'ExpenseController@getList');
    Route::post('update', 'ExpenseController@postUpdate');
    Route::post('delete', 'ExpenseController@postDelete');
    Route::post('create', 'ExpenseController@postCreate');
});