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

        $map = [];

        $rawData = DB::table('currencies')->get();

        $allowedISOCodes = [];

        foreach ($rawData as $currency) {
            $map[$currency->id] = (array) $currency;

            $allowedISOCodes[] = $currency->iso_code;
        }

        $xml = simplexml_load_file('http://www.bnr.ro/nbrfxrates.xml');

        $body = $xml->Body;

        $origCurrencyISOCode = (string)$body->OrigCurrency;

        $rates = [];

        $rates[$origCurrencyISOCode] = 1;

        foreach ($body->Cube->Rate as $rate) {
            $key = (string)$rate->attributes();

            if (in_array($key, $allowedISOCodes)) {
                $rates[$key] = (float)$rate;
            }
        }

        foreach ($map as $id => $currencyInfo) {
            $map[$id]['rates'] = [];

            foreach ($rates as $eachISOCode => $eachRate) {
                $map[$id]['rates'][$eachISOCode] = round(1 / $rates[$eachISOCode] * $rates[$currencyInfo['iso_code']], 4);
            }

            unset($map[$id]['rates'][$currencyInfo['iso_code']]);
        }

        self::$data = [
            'default' => self::getDefaultCurrency(),
            'map' => $map
        ];
    }

    public static function getDefaultCurrency() {
        if (self::$defaultCurrency === null) {
            self::$defaultCurrency = Currency::where(
                'iso_code', '=', Setting::where('key', '=', 'default_currency')->firstOrFail()->value
            )->firstOrFail();
        }

        return self::$defaultCurrency;
    }

    public function getCurrencies()
    {
        self::setupData();

        return Response::json(self::$data);
    }
}
