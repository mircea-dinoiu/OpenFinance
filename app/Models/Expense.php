<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model {
    protected $table = 'expenses';

    protected $hidden = ['pivot'];

    public function users() {
        return $this->belongsToMany('App\Models\User')->select(['id']);
    }

    public function categories() {
        return $this->belongsToMany('App\Models\Category')->select(['id']);
    }
}