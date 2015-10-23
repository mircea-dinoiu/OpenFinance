<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';

    protected $hidden = ['pivot'];

    protected $appends = ['expenses'];

    public function getExpensesAttribute()
    {
        return $this->expenses()->count();
    }

    public function expenses() {
        return $this->belongsToMany('App\Models\Expense')->select(['id']);
    }
}