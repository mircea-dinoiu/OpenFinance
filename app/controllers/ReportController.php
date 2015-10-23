<?php

class ReportController extends BaseController
{
    private function getPastIncomes($data)
    {
        $ret = ['users' => []];

        if ($data['start_date']) {
            $incomes = Income::whereRaw('DATE(created_at) < ?', [$data['start_date']])->get();

            foreach ($incomes as $income) {
                if (!isset($ret['users'][$income->user_id])) {
                    $ret['users'][$income->user_id] = 0;
                }

                $ret['users'][$income->user_id] += $income->sum;
            }
        }

        $ret['sum'] = array_sum($ret['users']);

        return $ret;
    }

    private function getPastExpenses($data)
    {
        $ret = ['users' => []];

        if ($data['start_date']) {
            $expenses = Expense::whereRaw('DATE(created_at) < ?', [$data['start_date']]);

            foreach (with(clone $expenses)->where('currency_id', '=', CurrencyController::getDefaultCurrency()->id)->get() as $expense) {
                $users = $expense->users()->where('blame', '1')->get();
                $sum = $expense->sum / count($users);

                foreach ($users as $user) {
                    if (!isset($ret['users'][$user->id])) {
                        $ret['users'][$user->id] = 0;
                    }

                    $ret['users'][$user->id] += $sum;
                }
            }

            foreach (with(clone $expenses)->where('currency_id', '<>', CurrencyController::getDefaultCurrency()->id)->get() as $expense) {
                $users = $expense->users()->where('blame', '1')->get();
                $sum = CurrencyController::convertToDefault($expense->sum, $expense->currency_id) / count($users);

                foreach ($users as $user) {
                    if (!isset($ret['users'][$user->id])) {
                        $ret['users'][$user->id] = 0;
                    }

                    $ret['users'][$user->id] += $sum;
                }
            }
        }

        $ret['sum'] = array_sum($ret['users']);

        return $ret;
    }

    private function getPastRemaining($pastExpenses, $pastIncomes)
    {
        $ret = [
            'users' => [],
            'sum' => $pastIncomes['sum'] - $pastExpenses['sum']
        ];

        foreach (array_merge(array_keys($pastExpenses['users']), array_keys($pastIncomes['users'])) as $userId) {
            $incomes = isset($pastIncomes['users'][$userId]) ? $pastIncomes['users'][$userId] : 0;
            $expenses = isset($pastExpenses['users'][$userId]) ? $pastExpenses['users'][$userId] : 0;

            $ret['users'][$userId] = $incomes - $expenses;
        }

        return $ret;
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
