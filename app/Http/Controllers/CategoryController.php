<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function getList()
    {
        return Response::json(Category::get());
    }

    public function postUpdate()
    {
        $data = Input::get('data');

        if (is_array($data) && !empty($data)) {
            $validationRules = [
                'id' => 'required|category_id',
                'name' => 'sometimes|required|string'
            ];

            $output = [];

            foreach ($data as $record) {
                $validator = Validator::make($record, $validationRules);

                if ($validator->passes()) {
                    $category = Category::find($record['id']);

                    if (isset($record['name'])) {
                        $category->name = trim($record['name']);
                    }

                    $category->save();

                    $output[] = $category;
                } else {
                    $output[] = $validator->messages();
                }
            }

            return Response::json($output);
        }

        return Response::json(Lang::get('general.invalid_input_data'), 400);
    }

    public function postCreate()
    {
        $data = Input::get('data');

        if (is_array($data) && !empty($data)) {
            $validationRules = [
                'name' => 'required|string'
            ];

            $output = [];

            foreach ($data as $record) {
                $validator = Validator::make($record, $validationRules);

                if ($validator->passes()) {
                    $category = new Category;

                    $category->name = trim($record['name']);

                    $category->save();

                    $output[] = $category;
                } else {
                    $output[] = $validator->messages();
                }
            }

            return Response::json($output);
        }

        return Response::json(Lang::get('general.invalid_input_data'), 400);
    }
}
