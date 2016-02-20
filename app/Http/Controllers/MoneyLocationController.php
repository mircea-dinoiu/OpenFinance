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
                'name' => 'sometimes|required|string'
            ];

            $output = [];

            foreach ($data as $record) {
                $validator = Validator::make($record, $validationRules);

                if ($validator->passes()) {
                    $moneyLocation = MoneyLocation::find($record['id']);

                    if (isset($record['name'])) {
                        $moneyLocation->name = trim($record['name']);
                    }

                    $moneyLocation->save();

                    $output[] = $moneyLocation;
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
                    $moneyLocation = new MoneyLocation;

                    $moneyLocation->name = trim($record['name']);

                    $moneyLocation->save();

                    $output[] = $moneyLocation;
                } else {
                    $output[] = $validator->messages();
                }
            }

            return Response::json($output);
        }

        return Response::json(Lang::get('general.invalid_input_data'), 400);
    }
}
