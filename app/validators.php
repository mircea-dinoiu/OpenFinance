<?php

function idValidator($Class) {
    return function ($attribute, $value) use ($Class) {
        if (!Validator::make([$attribute => $value], [$attribute => 'integer'])->passes()) {
            return false;
        }

        if (NULL === $Class::find($value)) {
            return false;
        }

        return true;
    };
}

function idsValidator($singleValidator) {
    return function ($attribute, $value) use ($singleValidator) {
        if (!Validator::make([$attribute => $value], [$attribute => 'array'])->passes()) {
            return false;
        }

        if (count(array_unique($value)) !== count($value)) {
            return false;
        }

        foreach ($value as $id) {
            if (!Validator::make([$attribute => $id], [$attribute => $singleValidator])->passes()) {
                return false;
            }
        }

        return true;
    };
}

foreach (
    [
        ['currency_id', \App\Models\Currency::class],
        ['expense_id', \App\Models\Expense::class],
        ['income_id', \App\Models\Income::class],
        ['user_id', \App\Models\User::class],
        ['category_id', \App\Models\Category::class],
        ['money_location_id', \App\Models\MoneyLocation::class],
        ['money_location_type_id', \App\Models\MLType::class],
    ]
as $each) {
    Validator::extend($each[0], idValidator($each[1]));
}

foreach (
    [
        ['user_ids', 'user_id'],
        ['category_ids', 'category_id'],
    ]
    as $each) {
    Validator::extend($each[0], idsValidator($each[1]));
}

Validator::extend('repeat', function ($attr, $value) {
    return in_array($value, ['d', 'w', 'm', 'y']);
});

Validator::extend('status', function ($attr, $value) {
    return in_array($value, ['finished', 'pending']);
});