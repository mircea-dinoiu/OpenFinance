<?php

class CategoryController extends \BaseController
{

    public function getList()
    {
        return Response::json(Category::with('expenses')->get());
    }
}
