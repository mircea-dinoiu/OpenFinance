<?php

use App\Models\Category;

Validator::extend('category_id', function ($attribute, $value) {
    if (!Validator::make([$attribute => $value], [$attribute => 'integer'])->passes()) {
        return false;
    }

    if (NULL === Category::find($value)) {
        return false;
    }

    return true;
});