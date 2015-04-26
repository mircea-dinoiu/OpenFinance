<?php

class BaseController extends Controller {
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