<?php

class ReportController extends BaseController
{
    private function getPastIncomes($data)
    {
        $sum = 0;

        if ($data['start_date']) {
            $incomes = (new Income)->newQuery();
            $incomes->whereRaw('DATE(created_at) < ?', [$data['start_date']]);

            $sum = $incomes->sum('sum');
        }

        return $sum;
    }

    private function getPastExpenses($data)
    {
        $sum = 0;

        if ($data['start_date']) {
            $expenses = (new Expense)->newQuery();

            $expenses->whereRaw('DATE(created_at) < ?', [$data['start_date']]);

            $sum += with(clone $expenses)->where('currency_id', '=', CurrencyController::getDefaultCurrency()->id)->sum('sum');

            foreach (with(clone $expenses)->where('currency_id', '<>', CurrencyController::getDefaultCurrency()->id)->get() as $record) {
                $sum += CurrencyController::convertToDefault($record->sum, $record->currency_id);
            }
        }

        return $sum;
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

            return Response::json([
                'past_remaining' => $pastIncomes - $pastExpenses,
                'past_incomes' => $pastIncomes,
                'past_expenses' => $pastExpenses
            ]);
        } else {
            return Response::json('Invalid input data', 400);
        }
    }
}
