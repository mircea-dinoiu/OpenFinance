<?php

class PlatformController extends Controller {
    private static $detect;

    public static function detect() {
        return isset(self::$detect) ? self::$detect : (self::$detect = new \Detection\MobileDetect());
    }

    public static function isMobile() {
        return (self::detect()->is('iOS') && (float)self::detect()->version('iOS') >= 7) || self::detect()->is('AndroidOS');
    }

    public static function isDesktop() {
        return !(self::detect()->isTablet() || self::detect()->isMobile());
    }

    public static function isSupported() {
        return self::isMobile() || self::isDesktop();
    }
}