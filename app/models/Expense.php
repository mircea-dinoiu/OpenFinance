<?php

class Expense extends Eloquent {
    protected $table = 'expenses';

    public function users() {
        return $this->belongsToMany('User');
    }
}