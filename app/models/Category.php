<?php

class Category extends Eloquent
{
    public $timestamps = false;

    protected $table = 'categories';

    protected $hidden = ['pivot'];
}