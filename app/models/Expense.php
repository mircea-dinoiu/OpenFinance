<?php

class Expense extends Eloquent {
    protected $table = 'expenses';

    protected $hidden = ['pivot'];

    public function users() {
        return $this->belongsToMany('User')->select(['id']);
    }

    public function categories() {
        return $this->belongsToMany('Category')->select(['id']);
    }
}