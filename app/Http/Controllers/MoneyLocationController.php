<?php

namespace App\Http\Controllers;

use App\Models\MoneyLocation;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;

class MoneyLocationController extends Controller
{
    public function getList()
    {
        return Response::json(MoneyLocation::get());
    }

    public function postUpdate()
    {
        $data = Input::get('data');

        if (is_array($data) && !empty($data)) {
            $validationRules = [
                'id' => 'required|money_location_id',
                'name' => 'sometimes|required|string',
                'type_id' => 'sometimes|required|money_location_type_id'
            ];

            $output = [];

            foreach ($data as $record) {
                $validator = Validator::make($record, $validationRules);

                if ($validator->passes()) {
                    $model = MoneyLocation::find($record['id']);

                    if (array_key_exists('name', $record)) {
                        $model->name = trim($record['name']);
                    }

                    if (array_key_exists('type_id', $record)) {
                        $model->type_id = $record['type_id'];
                    }

                    $model->save();

                    $output[] = $model;
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
                'name' => 'required|string',
                'type_id' => 'required|money_location_type_id'
            ];

            $output = [];

            foreach ($data as $record) {
                $validator = Validator::make($record, $validationRules);

                if ($validator->passes()) {
                    $model = new MoneyLocation;

                    $model->name = trim($record['name']);
                    $model->type_id = $record['type_id'];

                    $model->save();

                    $output[] = $model;
                } else {
                    $output[] = $validator->messages();
                }
            }

            return Response::json($output);
        }

        return Response::json(Lang::get('general.invalid_input_data'), 400);
    }
}
