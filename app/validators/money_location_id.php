<?php

use App\Models\MoneyLocation;

Validator::extend('money_location_id', function ($attribute, $value) {
    if (!Validator::make([$attribute => $value], [$attribute => 'integer'])->passes()) {
        return false;
    }

    if (NULL === MoneyLocation::find($value)) {
        return false;
    }

    return true;
});