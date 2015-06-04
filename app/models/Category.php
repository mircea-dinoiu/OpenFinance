<?php

class Category extends Eloquent
{
    protected $table = 'categories';

    protected $hidden = ['pivot'];
}