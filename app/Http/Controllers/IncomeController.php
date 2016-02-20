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
                'money_location_id' => 'sometimes|required|money_location_id',
                'created_at' => 'sometimes|required|integer'
            ];

            $output = [];

            foreach ($data as $record) {
                $validator = Validator::make($record, $validationRules);

                if ($validator->passes()) {
                    $income = Income::find($record['id']);

                    if (isset($record['sum'])) {
                        $income->sum = $record['sum'];
                    }

                    if (isset($record['description'])) {
                        $income->description = $record['description'];
                    }

                    if (isset($record['user_id'])) {
                        $income->user_id = $record['user_id'];
                    }

                    if (isset($record['money_location_id'])) {
                        $income->money_location_id = $record['money_location_id'];
                    }

                    if (isset($record['created_at'])) {
                        $income->created_at = date('Y-m-d H:i:s', $record['created_at']);
                    }

                    $income->save();

                    $output[] = $income;
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
                'money_location_id' => 'required|money_location_id',
                'created_at' => 'sometimes|required|integer'
            ];

            $output = [];

            foreach ($data as $record) {
                $validator = Validator::make($record, $validationRules);

                if ($validator->passes()) {
                    $income = new Income;

                    $income->sum = $record['sum'];
                    $income->description = $record['description'];
                    $income->user_id = $record['user_id'];
                    $income->money_location_id = $record['money_location_id'];

                    if (isset($record['created_at'])) {
                        $income->created_at = date('Y-m-d H:i:s', $record['created_at']);
                    }

                    $income->save();

                    $output[] = $income;
                } else {
                    $output[] = $validator->messages();
                }
            }

            return Response::json($output);
        }

        return Response::json(Lang::get('general.invalid_input_data'), 400);
    }
}
