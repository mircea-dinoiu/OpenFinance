<?php

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