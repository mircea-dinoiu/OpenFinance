<?php

namespace App\Http\Controllers;

use App\Models\Currency;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\View;

class HomeController extends Controller
{
    public function getData()
    {
        $data = [];

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
        }

        return View::make('not-supported');
    }

    public function getMobileIndex()
    {
        return View::make('mobile.main')->with([
            'baseUrl' => Config::get('app.url')
        ]);
    }

    public function getDesktopIndex()
    {
        $bootstrapScript = file_get_contents(app_path(sprintf(
            '../%s/microloader.html',
            Config::get('app.debug') ? 'sources/desktop' : 'public'
        )));

        return View::make('desktop.main')->with([
            'bootstrapScript' => $bootstrapScript,
            'baseUrl' => Config::get('app.url'),
            'isMobile' => PlatformController::isMobile()
        ]);
    }
}
