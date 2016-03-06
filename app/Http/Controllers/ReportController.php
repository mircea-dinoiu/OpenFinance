<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Income;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    private function getPastIncomes($data)
    {
        $ret = [
            'users' => [],
            'money_locations' => []
        ];

        if ($data['start_date']) {
            $incomes = Income::whereRaw('DATE(created_at) < ?', [$data['start_date']])->get();

            foreach ($incomes as $income) {
                if (!isset($ret['users'][$income->user_id])) {
                    $ret['users'][$income->user_id] = 0;
                }

                $mlId = (int) $income->money_location_id;

                if (!isset($ret['money_locations'][$mlId])) {
                    $ret['money_locations'][$mlId] = 0;
                }

                $ret['users'][$income->user_id] += $income->sum;
                $ret['money_locations'][$mlId] += $income->sum;
            }
        }

        $ret['sum'] = array_sum($ret['users']);
        $ret['users'] = (object) $ret['users'];
        $ret['money_locations'] = (object) $ret['money_locations'];

        return (object) $ret;
    }

    private function getPastExpenses($data)
    {
        $ret = [
            'users' => [],
            'money_locations' => []
        ];

        if ($data['start_date']) {
            $expenses = Expense::whereRaw('DATE(created_at) < ?', [$data['start_date']])->get();
            $defaultCurrencyId = CurrencyController::getDefaultCurrency()->id;

            foreach ($expenses as $expense) {
                $users = $expense->users()->where('blame', '1')->get();
                $mlId = (int) $expense->money_location_id;
                $sum = $expense->currency_id === $defaultCurrencyId ? $expense->sum : CurrencyController::convertToDefault($expense->sum, $expense->currency_id);

                if (!isset($ret['money_locations'][$mlId])) {
                    $ret['money_locations'][$mlId] = 0;
                }

                $ret['money_locations'][$mlId] += $sum;

                $sum /= count($users);
                foreach ($users as $user) {
                    if (!isset($ret['users'][$user->id])) {
                        $ret['users'][$user->id] = 0;
                    }

                    $ret['users'][$user->id] += $sum;
                }
            }
        }

        $ret['sum'] = array_sum($ret['users']);
        $ret['users'] = (object) $ret['users'];
        $ret['money_locations'] = (object) $ret['money_locations'];

        return (object) $ret;
    }

    private function getPastRemaining($pastExpenses, $pastIncomes)
    {
        $pastExpenses = json_decode(json_encode($pastExpenses), true);
        $pastIncomes = json_decode(json_encode($pastIncomes), true);

        $ret = [
            'users' => [],
            'money_locations' => [],
            'sum' => $pastIncomes['sum'] - $pastExpenses['sum']
        ];

        foreach (array_merge(array_keys($pastExpenses['users']), array_keys($pastIncomes['users'])) as $userId) {
            $incomes = isset($pastIncomes['users'][$userId]) ? $pastIncomes['users'][$userId] : 0;
            $expenses = isset($pastExpenses['users'][$userId]) ? $pastExpenses['users'][$userId] : 0;

            $ret['users'][$userId] = $incomes - $expenses;
        }

        foreach (array_merge(array_keys($pastExpenses['money_locations']), array_keys($pastIncomes['money_locations'])) as $mlId) {
            $incomes = isset($pastIncomes['money_locations'][$mlId]) ? $pastIncomes['money_locations'][$mlId] : 0;
            $expenses = isset($pastExpenses['money_locations'][$mlId]) ? $pastExpenses['money_locations'][$mlId] : 0;

            $ret['money_locations'][$mlId] = $incomes - $expenses;
        }

        $ret['users'] = (object) $ret['users'];
        $ret['money_locations'] = (object) $ret['money_locations'];

        return (object) $ret;
    }

    public function getReports()
    {
        $data = [
            'start_date' => Input::get('start_date')
        ];

        $validationRules = [
            'start_date' => 'sometimes|date_format:Y-m-d'
        ];

        $validator = Validator::make($data, $validationRules);

        if ($validator->passes()) {
            $pastExpenses = $this->getPastExpenses($data);
            $pastIncomes = $this->getPastIncomes($data);
            $pastRemaining = $this->getPastRemaining($pastExpenses, $pastIncomes);

            return Response::json([
                'past_remaining' => $pastRemaining,
                'past_incomes' => $pastIncomes,
                'past_expenses' => $pastExpenses
            ]);
        } else {
            return Response::json('Invalid input data', 400);
        }
    }
}
