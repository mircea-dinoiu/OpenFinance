<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Income extends Model {
    const STATUS_PENDING = 'pending';
    const STATUS_FINISHED = 'finished';

    protected $table = 'incomes';

    public function user() {
        return $this->belongsTo('App\Models\User')->select(['id']);
    }
}