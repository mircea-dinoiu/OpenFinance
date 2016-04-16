<?php

namespace App\Http\Controllers;

use App\Models\Income;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class IncomeController extends Controller
{
    public function getList()
    {
        $data = [
            'start_date' => Input::get('start_date'),
            'end_date' => Input::get('end_date')
        ];

        $validationRules = [
            'start_date' => 'sometimes|date_format:Y-m-d',
            'end_date' => 'sometimes|date_format:Y-m-d'
        ];

        $validator = Validator::make($data, $validationRules);

        if ($validator->passes()) {
            $query = Income::with('user');

            if ($data['start_date']) {
                $query->whereRaw('DATE(created_at) >= ?', [$data['start_date']]);
            }

            if ($data['end_date']) {
                $query->whereRaw('DATE(created_at) <= ?', [$data['end_date']]);
            }

            return Response::json(
                $query->orderBy('created_at', 'desc')->get()
            );
        }

        return Response::json($validator->messages(), 400);
    }

    public function postDelete()
    {
        $data = Input::get('data');

        if (is_array($data) && !empty($data)) {
            $validationRules = ['id' => 'required|income_id'];

            $output = [];

            foreach ($data as $record) {
                $validator = Validator::make($record, $validationRules);

                if ($validator->passes()) {
                    $output[] = Income::destroy($record['id']);
                } else {
                    $output[] = $validator->messages();
                }
            }

            return Response::json($output);
        }

        return Response::json(Lang::get('general.invalid_input_data'), 400);
    }

    public function postUpdate()
    {
        $data = Input::get('data');

        if (is_array($data) && !empty($data)) {
            $validationRules = [
                'id' => 'required|income_id',
                'sum' => 'sometimes|required|numeric|not_in:0',
                'description' => 'sometimes|required|string',
                'user_id' => 'sometimes|required|user_id',
                'money_location_id' => 'sometimes|money_location_id',
                'created_at' => 'sometimes|required|integer'
            ];

            $output = [];

            foreach ($data as $record) {
                if (isset($record['money_location_id']) && $record['money_location_id'] == 0) {
                    $record['money_location_id'] = NULL;
                }

                $validator = Validator::make($record, $validationRules);

                if ($validator->passes()) {
                    $model = Income::find($record['id']);

                    if (isset($record['sum'])) {
                        $model->sum = $record['sum'];
                    }

                    if (isset($record['description'])) {
                        $model->description = $record['description'];
                    }

                    if (isset($record['user_id'])) {
                        $model->user_id = $record['user_id'];
                    }

                    if (isset($record['money_location_id'])) {
                        $model->money_location_id = $record['money_location_id'];
                    }

                    if (isset($record['created_at'])) {
                        $model->created_at = date('Y-m-d H:i:s', $record['created_at']);
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
                'sum' => 'required|numeric|not_in:0',
                'description' => 'required|string',
                'user_id' => 'required|user_id',
                'money_location_id' => 'sometimes|money_location_id',
                'created_at' => 'sometimes|required|integer'
            ];

            $output = [];

            foreach ($data as $record) {
                if (isset($record['money_location_id']) && $record['money_location_id'] == 0) {
                    $record['money_location_id'] = NULL;
                }

                $validator = Validator::make($record, $validationRules);

                if ($validator->passes()) {
                    $model = new Income;

                    $model->sum = $record['sum'];
                    $model->description = $record['description'];
                    $model->user_id = $record['user_id'];

                    if (isset($record['money_location_id'])) {
                        $model->money_location_id = $record['money_location_id'];
                    }

                    if (isset($record['created_at'])) {
                        $model->created_at = date('Y-m-d H:i:s', $record['created_at']);
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
}
