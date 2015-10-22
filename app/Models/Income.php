<?php

namespace App\Models;

class Income extends Illuminate\Database\Eloquent\Model {
    protected $table = 'incomes';

    public function user() {
        return $this->belongsTo('User')->select(['id']);
    }
}