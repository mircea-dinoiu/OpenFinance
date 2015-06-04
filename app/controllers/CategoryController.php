<?php

class CategoryController extends \BaseController
{

    public function listCategories()
    {
        return Response::json(Category::all());
    }
}
