<?php

use App\Models\Currency;

Validator::extend('currency_id', function ($attribute, $value) {
    if (!Validator::make([$attribute => $value], [$attribute => 'integer'])->passes()) {
        return false;
    }

    if (NULL === Currency::find($value)) {
        return false;
    }

    return true;
});
