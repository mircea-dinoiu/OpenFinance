<?php

class ExpenseController extends BaseController
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
            $query = Expense::with([
                'users' => function ($query) {
                    $query->where('blame', '=', '1')->get();
                },
                'categories'
            ]);

            if ($data['start_date']) {
                $query->whereRaw('DATE(created_at) >= ?', [$data['start_date']]);
            }

            if ($data['end_date']) {
                $query->whereRaw('DATE(created_at) <= ?', [$data['end_date']]);
            }

            return Response::json(
                $query->orderBy('created_at', 'desc')->get()
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
                'sum' => 'sometimes|numeric|not_in:0',
                'item' => 'sometimes|string',
                'created_at' => 'sometimes|integer',
                'currency_id' => 'sometimes|currency_id',
                'status' => 'sometimes|string|in:finished,pending',
                'users' => 'sometimes|user_ids',
                'categories' => 'sometimes|category_ids'
            ];

            $validator = Validator::make($data, $validationRules);

            if ($validator->passes()) {
                $expense = Expense::find($data['id']);

                if (isset($data['sum'])) {
                    $expense->sum = $data['sum'];
                }

                if (isset($data['item'])) {
                    $expense->item = trim($data['item']);
                }

                if (isset($data['currency_id'])) {
                    $expense->currency_id = $data['currency_id'];

                    if ($data['currency_id'] !== CurrencyController::getDefaultCurrency()->id) {
                        $expense->status = 'pending';
                    }
                }

                if (isset($data['status'])) {
                    $expense->status = $data['status'];

                    if ($expense->status === 'finished') {
                        $expense->sum = CurrencyController::convertToDefault($expense->sum, $expense->currency_id);
                        $expense->currency_id = CurrencyController::getDefaultCurrency()->id;
                    }
                }

                if (isset($data['created_at'])) {
                    $expense->created_at = date('Y-m-d H:i:s', $data['created_at']);
                }

                $expense->save();

                /**
                 * Categories
                 */
                if (isset($data['categories'])) {
                    DB::table('category_expense')->where('expense_id', '=', $expense->id)->delete();
                    foreach ($data['categories'] as $id) {
                        DB::table('category_expense')->insert([
                            'category_id' => $id,
                            'expense_id' => $expense->id
                        ]);
                    }
                }

                /**
                 * Users
                 */
                if (isset($data['users'])) {
                    foreach (User::all() as $user) {
                        DB::table('expense_user')
                            ->where('expense_id', '=', $expense->id)
                            ->where('user_id', '=', $user->id)
                            ->update([
                                'blame' => in_array($user->id, $data['users'])
                            ]);
                    }
                }

                return Response::json($expense);
            } else {
                return Response::json($validator->messages(), 400);
            }
        }

        return Response::json(Lang::get('general.invalid_input_data'), 400);
    }

    public function postDelete()
    {
        $data = Input::get('data');

        if (is_array($data) && !empty($data)) {
            if (Validator::make($data, ['id' => 'required|expense_id'])->passes()) {
                return Expense::destroy($data['id']);
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
                'item' => 'required|string',
                'users' => 'required|user_ids',
                'created_at' => 'sometimes|integer',
                'currency_id' => 'sometimes|currency_id',
                'categories' => 'sometimes|category_ids'
            ];

            $validator = Validator::make($data, $validationRules);

            if ($validator->passes()) {
                $expense = new Expense;

                $expense->sum = $data['sum'];
                $expense->item = trim($data['item']);
                $expense->status = 'pending';

                if (isset($data['currency_id'])) {
                    $expense->currency_id = $data['currency_id'];
                } else {
                    $expense->currency_id = CurrencyController::getDefaultCurrency()->id;
                }

                if (isset($data['created_at'])) {
                    $expense->created_at = date('Y-m-d H:i:s', $data['created_at']);
                }

                $expense->save();

                if (isset($data['categories']) && count($data['categories']) > 0) {
                    foreach ($data['categories'] as $id) {
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
                        'blame' => in_array($user->id, $data['users']),
                        'seen' => ($user->id === Auth::user()->id)
                    ]);
                }

                return Response::json($expense);
            } else {
                return Response::json($validator->messages(), 400);
            }
        }

        return Response::json(Lang::get('general.invalid_input_data'), 400);
    }
}
