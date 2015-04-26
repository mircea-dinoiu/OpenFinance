<?php

class HomeController extends BaseController
{
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
        if (PlatformController::isSupported()) {
            if (PlatformController::isMobile()) {
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
        if (!Auth::check()) {
            return Redirect::to('user/login');
        } else {
            return $this->layout->with('content', 'Nothing bitch');
        }
    }
}
