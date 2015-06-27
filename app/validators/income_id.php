<?php

Validator::extend('income_id', function ($attribute, $value) {
    if (!Validator::make([$attribute => $value], [$attribute => 'integer'])->passes()) {
        return false;
    }

    if (NULL === Income::find($value)) {
        return false;
    }

    return true;
});