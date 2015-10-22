<?php

namespace App\Models;

class Category extends Illuminate\Database\Eloquent\Model
{
    protected $table = 'categories';

    protected $hidden = ['pivot'];

    protected $appends = ['expenses'];

    public function getExpensesAttribute()
    {
        return $this->expenses()->count();
    }

    public function expenses() {
        return $this->belongsToMany('Expense')->select(['id']);
    }
}