<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Income extends Model {
    protected $table = 'incomes';

    public function user() {
        return $this->belongsTo('App\Models\User')->select(['id']);
    }
}