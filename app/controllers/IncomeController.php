<?php

class IncomeController extends BaseController
{
    public function getList()
    {
        $data = [
            'month' => Input::get('month'),
            'year' => Input::get('year')
        ];

        $validationRules = [
            'month' => 'sometimes|min:1|max:12|numeric',
            'year' => 'sometimes|min:1970|max:2100|numeric'
        ];

        $validator = Validator::make($data, $validationRules);

        if ($validator->passes()) {
            $query = Income::with('user');

            if ($data['month']) {
                $query->whereRaw('MONTH(created_at) = ?', [$data['month']]);
            }

            if ($data['year']) {
                $query->whereRaw('YEAR(created_at) = ?', [$data['year']]);
            }

            return Response::json(
                $query->orderBy('created_at', 'desc')->get()
            );
        } else {
            return Response::json('Invalid input data', 400);
        }
    }
}
