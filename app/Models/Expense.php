<?php

namespace App\Models;

class Expense extends Illuminate\Database\Eloquent\Model {
    protected $table = 'expenses';

    protected $hidden = ['pivot'];

    public function users() {
        return $this->belongsToMany('User')->select(['id']);
    }

    public function categories() {
        return $this->belongsToMany('Category')->select(['id']);
    }
}