<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class ExpenseController extends Controller
{
    public function getList()
    {
        $data = [
            'start_date' => Input::get('start_date'),
            'end_date' => Input::get('end_date'),
            'filters' => Input::get('filters'),
            'page' => Input::get('page'),
            'per_page' => Input::get('per_page')
        ];

        $validationRules = [
            'start_date' => 'sometimes|date_format:Y-m-d',
            'end_date' => 'sometimes|date_format:Y-m-d',
            'filters' => 'sometimes|array',
            'page' => 'sometimes|numeric',
            'per_page' => 'sometimes|numeric'
        ];

        $validator = Validator::make($data, $validationRules);

        if ($validator->passes()) {
            $query = Expense::query();

            if ($data['start_date']) {
                $query->whereRaw('DATE(created_at) >= ?', [$data['start_date']]);
            }

            if ($data['end_date']) {
                $query->whereRaw('DATE(created_at) <= ?', [$data['end_date']]);
            }

            if ($data['filters']) {
                foreach ($data['filters'] as $key => $value) {
                    if (in_array($key, ['status'])) {
                        $query->whereRaw("$key = ?", [$value]);
                    }
                }
            }

            if (isset($data['page']) && isset($data['per_page'])) {
                $perPage = $data['per_page'];

                return Response::json(
                    $query->skip(($data['page'] - 1) * $perPage)->take($perPage)->orderBy('created_at', 'desc')->get()
                );
            } else {
                return Response::json(
                    $query->get()
                );
            }
        } else {
            return Response::json($validator->messages(), 400);
        }
    }

    public function postUpdate()
    {
        $data = Input::get('data');
        $validRecords = [];
        $errors = [];

        if (is_array($data) && !empty($data)) {
            $validationRules = [
                'id' => 'required|expense_id',
                'sum' => 'sometimes|required|numeric|not_in:0',
                'item' => 'sometimes|required|string',
                'repeat' => 'sometimes|repeat',
                'created_at' => 'sometimes|required|integer',
                'currency_id' => 'sometimes|required|currency_id',
                'money_location_id' => 'sometimes|money_location_id',
                'status' => 'sometimes|required|status',
                'users' => 'sometimes|required|user_ids',
                'categories' => 'sometimes|category_ids'
            ];

            foreach ($data as $record) {
                if (array_key_exists('money_location_id', $record) && $record['money_location_id'] == 0) {
                    $record['money_location_id'] = NULL;
                }

                $validator = Validator::make($record, $validationRules);

                if ($validator->passes()) {
                    $validRecords[] = $record;
                } else {
                    $errors[] = $validator->messages();
                }
            }

            if (count($errors) > 0) {
                return Response::json($errors, 400);
            } else {
                $output = [];

                foreach ($validRecords as $record) {
                    $model = Expense::find($record['id']);

                    if (array_key_exists('sum', $record)) {
                        $model->sum = $record['sum'];
                    }

                    if (array_key_exists('item', $record)) {
                        $model->item = trim($record['item']);
                    }

                    if (array_key_exists('repeat', $record)) {
                        $model->repeat = $record['repeat'];

                        if ($model->repeat != null) {
                            $model->status = Expense::STATUS_PENDING;
                        }
                    }

                    if (array_key_exists('currency_id', $record)) {
                        $model->currency_id = $record['currency_id'];

                        if ($record['currency_id'] !== CurrencyController::getDefaultCurrency()->id) {
                            $model->status = Expense::STATUS_PENDING;
                            unset($record['status']);
                        }
                    }

                    if (array_key_exists('money_location_id', $record)) {
                        $model->money_location_id = $record['money_location_id'];
                    }

                    if (array_key_exists('status', $record)) {
                        $model->status = $record['status'];

                        if ($model->status === Expense::STATUS_FINISHED) {
                            $model->sum = CurrencyController::convertToDefault($model->sum, $model->currency_id);
                            $model->currency_id = CurrencyController::getDefaultCurrency()->id;
                            $model->repeat = null;
                        }
                    }

                    if (array_key_exists('created_at', $record)) {
                        $model->created_at = standardDate($record['created_at']);
                    }

                    $model->save();

                    /**
                     * Categories
                     */
                    if (array_key_exists('categories', $record)) {
                        DB::table('category_expense')->where('expense_id', '=', $model->id)->delete();
                        foreach ($record['categories'] as $id) {
                            DB::table('category_expense')->insert([
                                'category_id' => $id,
                                'expense_id' => $model->id
                            ]);
                        }
                    }

                    /**
                     * Users
                     */
                    if (array_key_exists('users', $record)) {
                        foreach (User::all() as $user) {
                            DB::table('expense_user')
                                ->where('expense_id', '=', $model->id)
                                ->where('user_id', '=', $user->id)
                                ->update([
                                    'blame' => in_array($user->id, $record['users'])
                                ]);
                        }
                    }

                    $output[] = Expense::query()->find($model->id);
                }

                return Response::json($output);
            }
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
        $validRecords = [];
        $errors = [];

        if (is_array($data) && !empty($data)) {
            $validationRules = [
                'sum' => 'required|numeric|not_in:0',
                'item' => 'required|string',
                'repeat' => 'sometimes|repeat',
                'users' => 'required|user_ids',
                'created_at' => 'sometimes|required|integer',
                'currency_id' => 'sometimes|required|currency_id',
                'money_location_id' => 'sometimes|money_location_id',
                'categories' => 'sometimes|category_ids'
            ];

            foreach ($data as $record) {
                if (array_key_exists('money_location_id', $record) && $record['money_location_id'] == 0) {
                    $record['money_location_id'] = NULL;
                }

                $validator = Validator::make($record, $validationRules);

                if ($validator->passes()) {
                    $validRecords[] = $record;
                } else {
                    $errors[] = $validator->messages();
                }
            }

            if (count($errors) > 0) {
                return Response::json($errors, 400);
            } else {
                $output = [];

                foreach ($validRecords as $record) {
                    $model = $this->create($record);

                    $output[] = Expense::query()->find($model->id);
                }

                return Response::json($output);
            }
        }

        return Response::json(Lang::get('general.invalid_input_data'), 400);
    }

    protected function create($record) {
        $model = new Expense;

        $model->sum = $record['sum'];
        $model->item = trim($record['item']);
        $model->status = Expense::STATUS_PENDING;

        if (array_key_exists('repeat', $record)) {
            $model->repeat = $record['repeat'];
        }

        if (array_key_exists('money_location_id', $record)) {
            $model->money_location_id = $record['money_location_id'];
        }

        if (array_key_exists('currency_id', $record)) {
            $model->currency_id = $record['currency_id'];
        } else {
            $model->currency_id = CurrencyController::getDefaultCurrency()->id;
        }

        if (array_key_exists('created_at', $record)) {
            $model->created_at = standardDate($record['created_at']);
        }

        $model->save();

        if (array_key_exists('categories', $record) && count($record['categories']) > 0) {
            foreach ($record['categories'] as $id) {
                DB::table('category_expense')->insert([
                    'category_id' => $id,
                    'expense_id' => $model->id
                ]);
            }
        }

        foreach (User::all() as $user) {
            DB::table('expense_user')->insert([
                'user_id' => $user->id,
                'expense_id' => $model->id,
                'blame' => in_array($user->id, $record['users']),
                'seen' => ($user->id === Auth::user()->id)
            ]);
        }

        return $model;
    }
}