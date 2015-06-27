<?php

class Income extends Eloquent {
    protected $table = 'incomes';

    public function user() {
        return $this->belongsTo('User')->select(['id']);
    }
}