<?php

class HomeController extends BaseController
{
    private function isSupported($detect)
    {
        return (
            ($detect->is('iOS') && (float)$detect->version('iOS') >= 7) ||
            $detect->is('AndroidOS')
        );
    }

    public function getData()
    {
        $data = [];

//        $data['currencies'] = DB::table('currencies')->select('id', 'iso_code', 'currency', 'symbol')->get();
//        $data['users'] = DB::table('users')->select('id', 'first_name', 'last_name', 'email')->get();

        $data['currencies'] = Currency::all();
        $data['users'] = User::all();

        return Response::json($data);
    }

    public function getIndex()
    {
        $detect = new \Detection\MobileDetect();

        if ($this->isSupported($detect)) {
            if ($detect->isMobile()) {
                return $this->getMobileIndex();
            } else {
                return $this->getDesktopIndex();
            }
        } else {
            return View::make('not-supported');
        }
    }

    public function getMobileIndex()
    {
        return View::make('mobile.main');
    }

    public function getDesktopIndex()
    {
        return View::make('desktop.main');
    }
}
