<?php

use App\Models\Expense;

Validator::extend('expense_id', function ($attribute, $value) {
    if (!Validator::make([$attribute => $value], [$attribute => 'integer'])->passes()) {
        return false;
    }

    if (NULL === Expense::find($value)) {
        return false;
    }

    return true;
});