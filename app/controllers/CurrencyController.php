<?php

class CurrencyController extends BaseController
{
    private static $data = null;

    private static $defaultCurrency = null;

    public function convert($from, $to)
    {

    }

    private static function setupData()
    {
        if (self::$data !== null) {
            return;
        }

        $list = [];

        $rawData = DB::table('currencies')->get();

        foreach ($rawData as $currency) {
            $list[$currency->iso_code] = [
                'symbol' => $currency->symbol
            ];
        }

        $xml = simplexml_load_file('http://www.bnr.ro/nbrfxrates.xml');

        $body = $xml->Body;

        $origCurrencyISOCode = (string)$body->OrigCurrency;

        $rates = [];

        $rates[$origCurrencyISOCode] = 1;

        foreach ($body->Cube->Rate as $rate) {
            $key = (string)$rate->attributes();

            if (isset($list[$key])) {
                $rates[$key] = (float)$rate;
            }
        }

        foreach ($list as $ISOCode => $currencyInfo) {
            $list[$ISOCode]['rates'] = [];

            foreach ($rates as $eachISOCode => $eachRate) {
                $list[$ISOCode]['rates'][$eachISOCode] = round(1 / $rates[$eachISOCode] * $rates[$ISOCode], 4);
            }

            unset($list[$ISOCode]['rates'][$ISOCode]);
        }

        self::$data = [
            'default' => self::getDefaultCurrency(),
            'list' => $list
        ];
    }

    public static function getDefaultCurrency() {
        if (self::$defaultCurrency === null) {
            self::$defaultCurrency = Setting::where('key', '=', 'default_currency')->firstOrFail()->value;
        }

        return self::$defaultCurrency;
    }

    public function getCurrencies()
    {
        self::setupData();

        return Response::json(self::$data);
    }
}
