<?php

Validator::extend('currency_id', function ($attribute, $value) {
    if (!Validator::make([$attribute => $value], [$attribute => 'integer'])->passes()) {
        return false;
    }

    if (NULL === Currency::find($value)) {
        return false;
    }

    return true;
});

Validator::extend('expense_id', function ($attribute, $value) {
    if (!Validator::make([$attribute => $value], [$attribute => 'integer'])->passes()) {
        return false;
    }

    if (NULL === Expense::find($value)) {
        return false;
    }

    return true;
});

Validator::extend('income_id', function ($attribute, $value) {
    if (!Validator::make([$attribute => $value], [$attribute => 'integer'])->passes()) {
        return false;
    }

    if (NULL === Income::find($value)) {
        return false;
    }

    return true;
});

Validator::extend('user_id', function ($attribute, $value) {
    if (!Validator::make([$attribute => $value], [$attribute => 'integer'])->passes()) {
        return false;
    }

    if (NULL === User::find($value)) {
        return false;
    }

    return true;
});

Validator::extend('user_ids', function ($attribute, $value) {
    if (!Validator::make([$attribute => $value], [$attribute => 'array'])->passes()) {
        return false;
    }

    if (count(array_unique($value)) !== count($value)) {
        return false;
    }

    foreach ($value as $id) {
        if (!Validator::make([$attribute => $id], [$attribute => 'user_id'])->passes()) {
            return false;
        }
    }

    return true;
});

Validator::extend('category_id', function ($attribute, $value) {
    if (!Validator::make([$attribute => $value], [$attribute => 'integer'])->passes()) {
        return false;
    }

    if (NULL === Category::find($value)) {
        return false;
    }

    return true;
});

Validator::extend('category_ids', function ($attribute, $value) {
    if (!Validator::make([$attribute => $value], [$attribute => 'array'])->passes()) {
        return false;
    }

    if (count(array_unique($value)) !== count($value)) {
        return false;
    }

    foreach ($value as $id) {
        if (!Validator::make([$attribute => $id], [$attribute => 'category_id'])->passes()) {
            return false;
        }
    }

    return true;
});