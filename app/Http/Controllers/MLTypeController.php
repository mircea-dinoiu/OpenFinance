<?php

namespace App\Http\Controllers;

use App\Models\MLType;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;

class MLTypeController extends Controller
{
    public function getList()
    {
        return Response::json(MLType::get());
    }

    public function postUpdate()
    {
        $data = Input::get('data');

        if (is_array($data) && !empty($data)) {
            $validationRules = [
                'id' => 'required|money_location_type_id',
                'name' => 'sometimes|required|string'
            ];

            $output = [];

            foreach ($data as $record) {
                $validator = Validator::make($record, $validationRules);

                if ($validator->passes()) {
                    $mlType = MLType::find($record['id']);

                    if (isset($record['name'])) {
                        $mlType->name = trim($record['name']);
                    }

                    $mlType->save();

                    $output[] = $mlType;
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
                    $mlType = new MLType;

                    $mlType->name = trim($record['name']);

                    $mlType->save();

                    $output[] = $mlType;
                } else {
                    $output[] = $validator->messages();
                }
            }

            return Response::json($output);
        }

        return Response::json(Lang::get('general.invalid_input_data'), 400);
    }
}
