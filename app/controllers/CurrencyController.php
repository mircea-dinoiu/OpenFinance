<?php

class CurrencyController extends BaseController
{
    public function convert($from, $to) {

    }

    public function getCurrencies() {
        $currencies = DB::table('currencies')->get();

        return Response::json($currencies);
    }
}
