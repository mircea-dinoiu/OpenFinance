<?php

class Category extends Eloquent
{
    public $timestamps = false;

    protected $table = 'categories';

    protected $hidden = ['pivot'];

    public function expenses() {
        return $this->belongsToMany('Expense')->select(['id']);
    }
}