<?php

use App\Models\User;

Validator::extend('user_id', function ($attribute, $value) {
    if (!Validator::make([$attribute => $value], [$attribute => 'integer'])->passes()) {
        return false;
    }

    if (NULL === User::find($value)) {
        return false;
    }

    return true;
});
