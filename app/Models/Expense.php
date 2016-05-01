<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model {
    const STATUS_PENDING = 'pending';
    const STATUS_FINISHED = 'finished';

    protected $table = 'expenses';

    protected $hidden = ['pivot'];

    protected $appends = ['users', 'categories'];

    public function getUsersAttribute() {
        return $this->users()->where('blame', '=', '1')->lists('id')->toArray();
    }

    public function getCategoriesAttribute() {
        return $this->categories()->lists('id')->toArray();
    }

    public function users() {
        return $this->belongsToMany('App\Models\User')->select(['id']);
    }

    public function categories() {
        return $this->belongsToMany('App\Models\Category')->select(['id']);
    }
}