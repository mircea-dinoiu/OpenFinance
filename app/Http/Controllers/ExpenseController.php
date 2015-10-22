<?php

namespace App\Http\Controllers;

class ExpenseController extends Controller
{
    private static function newExpenseQuery()
    {
        return Expense::with([
            'users' => function ($query) {
                $query->where('blame', '=', '1');
            },
            'categories'
        ]);
    }

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
            $query = static::newExpenseQuery();

            if ($data['start_date']) {
                $query->whereRaw('DATE(created_at) >= ?', [$data['start_date']]);
            }

            if ($data['end_date']) {
                $query->whereRaw('DATE(created_at) <= ?', [$data['end_date']]);
            }

            return Response::json(
                $query->get()
            );
        } else {
            return Response::json(Lang::get('general.invalid_input_data'), 400);
        }
    }

    public function postUpdate()
    {
        $data = Input::get('data');

        if (is_array($data) && !empty($data)) {
            $validationRules = [
                'id' => 'required|expense_id',
                'sum' => 'sometimes|required|numeric|not_in:0',
                'item' => 'sometimes|required|string',
                'created_at' => 'sometimes|required|integer',
                'currency_id' => 'sometimes|required|currency_id',
                'status' => 'sometimes|required|string|in:finished,pending',
                'users' => 'sometimes|required|user_ids',
                'categories' => 'sometimes|category_ids'
            ];

            $output = [];

            foreach ($data as $record) {
                $validator = Validator::make($record, $validationRules);

                if ($validator->passes()) {
                    $expense = Expense::find($record['id']);

                    if (isset($record['sum'])) {
                        $expense->sum = $record['sum'];
                    }

                    if (isset($record['item'])) {
                        $expense->item = trim($record['item']);
                    }

                    if (isset($record['currency_id'])) {
                        $expense->currency_id = $record['currency_id'];

                        if ($record['currency_id'] !== CurrencyController::getDefaultCurrency()->id) {
                            $expense->status = 'pending';
                        }
                    }

                    if (isset($record['status'])) {
                        $expense->status = $record['status'];

                        if ($expense->status === 'finished') {
                            $expense->sum = CurrencyController::convertToDefault($expense->sum, $expense->currency_id);
                            $expense->currency_id = CurrencyController::getDefaultCurrency()->id;
                        }
                    }

                    if (isset($record['created_at'])) {
                        $expense->created_at = date('Y-m-d H:i:s', $record['created_at']);
                    }

                    $expense->save();

                    /**
                     * Categories
                     */
                    if (isset($record['categories'])) {
                        DB::table('category_expense')->where('expense_id', '=', $expense->id)->delete();
                        foreach ($record['categories'] as $id) {
                            DB::table('category_expense')->insert([
                                'category_id' => $id,
                                'expense_id' => $expense->id
                            ]);
                        }
                    }

                    /**
                     * Users
                     */
                    if (isset($record['users'])) {
                        foreach (User::all() as $user) {
                            DB::table('expense_user')
                                ->where('expense_id', '=', $expense->id)
                                ->where('user_id', '=', $user->id)
                                ->update([
                                    'blame' => in_array($user->id, $record['users'])
                                ]);
                        }
                    }

                    $output[] = static::newExpenseQuery()->find($expense->id);
                } else {
                    $output[] = $validator->messages();
                }
            }

            return Response::json($output);
        }

        return Response::json(Lang::get('general.invalid_input_data'), 400);
    }

    public function postDelete()
    {
        $data = Input::get('data');

        if (is_array($data) && !empty($data)) {
            $validationRules = ['id' => 'required|expense_id'];

            $output = [];

            foreach ($data as $record) {
                $validator = Validator::make($record, $validationRules);

                if ($validator->passes()) {
                    $output[] = Expense::destroy($record['id']);
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
                'item' => 'required|string',
                'users' => 'required|user_ids',
                'created_at' => 'sometimes|required|integer',
                'currency_id' => 'sometimes|required|currency_id',
                'categories' => 'sometimes|category_ids'
            ];

            $output = [];

            foreach ($data as $record) {
                $validator = Validator::make($record, $validationRules);

                if ($validator->passes()) {
                    $expense = new Expense;

                    $expense->sum = $record['sum'];
                    $expense->item = trim($record['item']);
                    $expense->status = 'pending';

                    if (isset($record['currency_id'])) {
                        $expense->currency_id = $record['currency_id'];
                    } else {
                        $expense->currency_id = CurrencyController::getDefaultCurrency()->id;
                    }

                    if (isset($record['created_at'])) {
                        $expense->created_at = date('Y-m-d H:i:s', $record['created_at']);
                    }

                    $expense->save();

                    if (isset($record['categories']) && count($record['categories']) > 0) {
                        foreach ($record['categories'] as $id) {
                            DB::table('category_expense')->insert([
                                'category_id' => $id,
                                'expense_id' => $expense->id
                            ]);
                        }
                    }

                    foreach (User::all() as $user) {
                        DB::table('expense_user')->insert([
                            'user_id' => $user->id,
                            'expense_id' => $expense->id,
                            'blame' => in_array($user->id, $record['users']),
                            'seen' => ($user->id === Auth::user()->id)
                        ]);
                    }

                    $output[] = static::newExpenseQuery()->find($expense->id);
                } else {
                    $output[] = $validator->messages();
                }
            }

            return Response::json($output);
        }

        return Response::json(Lang::get('general.invalid_input_data'), 400);
    }
}