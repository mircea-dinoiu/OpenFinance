<?php

class CategoryController extends \BaseController
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

            if (isset($data['id'])) {
                $data = [$data];
            }

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

            return Response::json(count($output) === 1 ? $output[0] : $output);
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

            $validator = Validator::make($data, $validationRules);

            if ($validator->passes()) {
                $category = new Category;

                $category->name = trim($data['name']);

                $category->save();

                return Response::json($category);
            } else {
                return Response::json($validator->messages(), 400);
            }
        }

        return Response::json(Lang::get('general.invalid_input_data'), 400);
    }
}
