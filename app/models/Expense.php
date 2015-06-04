<?php

class Expense extends Eloquent {
    protected $table = 'expenses';

    public function users() {
        return $this->belongsToMany('User')->select(['id']);
    }

    public function categories() {
        return $this->belongsToMany('Category')->select(['id']);
    }
}