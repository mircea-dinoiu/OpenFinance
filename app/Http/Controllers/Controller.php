<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    private function getLayout() {
        if (is_null($this->layout)) {
            if (PlatformController::isDesktop()) {
                $this->layout = 'desktop.main';
            } else {
                $this->layout = 'mobile.main';
            }
        }

        return $this->layout;
    }

    /**
     * Setup the layout used by the controller.
     *
     * @return void
     */
    protected function setupLayout()
    {
        if ( ! is_null($this->getLayout()))
        {
            $this->layout = View::make($this->getLayout());
        }
    }
}
