<?php

class IncomeController extends BaseController
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
            if (Validator::make($data, ['id' => 'required|income_id'])->passes()) {
                return Income::destroy($data['id']);
            }
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
                'created_at' => 'sometimes|required|integer'
            ];

            $validator = Validator::make($data, $validationRules);

            if ($validator->passes()) {
                $income = Income::find($data['id']);

                if (isset($data['sum'])) {
                    $income->sum = $data['sum'];
                }

                if (isset($data['description'])) {
                    $income->description = $data['description'];
                }

                if (isset($data['user_id'])) {
                    $income->user_id = $data['user_id'];
                }

                if (isset($data['created_at'])) {
                    $income->created_at = date('Y-m-d H:i:s', $data['created_at']);
                }

                $income->save();

                return Response::json($income);
            } else {
                return Response::json($validator->messages(), 400);
            }
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
                'created_at' => 'sometimes|required|integer'
            ];

            $validator = Validator::make($data, $validationRules);

            if ($validator->passes()) {
                $income = new Income;

                $income->sum = $data['sum'];
                $income->description = $data['description'];
                $income->user_id = $data['user_id'];

                if (isset($data['created_at'])) {
                    $income->created_at = date('Y-m-d H:i:s', $data['created_at']);
                }

                $income->save();

                return Response::json($income);
            } else {
                return Response::json($validator->messages(), 400);
            }
        }

        return Response::json(Lang::get('general.invalid_input_data'), 400);
    }
}
