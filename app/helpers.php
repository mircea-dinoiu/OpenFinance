<?php


class Calculator
{
    const PATTERN = '/(?:\-?\d+(?:\.?\d+)?[\+\-\*\/])+\-?\d+(?:\.?\d+)?/';

    const PARENTHESIS_DEPTH = 10;

    public static function calculate($input)
    {
        if (strpos($input, '+') != null || strpos($input, '-') != null || strpos($input, '/') != null || strpos($input, '*') != null) {
            //  Remove white spaces and invalid math chars
            $input = str_replace(',', '.', $input);
            $input = preg_replace('[^0-9\.\+\-\*\/\(\)]', '', $input);

            //  Calculate each of the parenthesis from the top
            $i = 0;
            while (strpos($input, '(') || strpos($input, ')')) {
                $input = preg_replace_callback('/\(([^\(\)]+)\)/', 'self::callback', $input);

                $i++;
                if ($i > self::PARENTHESIS_DEPTH) {
                    break;
                }
            }

            //  Calculate the result
            if (preg_match(self::PATTERN, $input, $match)) {
                return self::compute($match[0]);
            }

            return 0;
        }

        return $input;
    }

    private static function compute($input)
    {
        $compute = create_function('', 'return ' . $input . ';');

        return 0 + $compute();
    }

    private static function callback($input)
    {
        if (is_numeric($input[1])) {
            return $input[1];
        } elseif (preg_match(self::PATTERN, $input[1], $match)) {
            return self::compute($match[0]);
        }

        return 0;
    }
}

function standardDate($date) {
    $format = 'Y-m-d H:i:s';

    if ($date instanceof DateTime) {
        return $date->format($format);
    }

    try {
        return date($format, $date);
    } catch (Exception $e) {
        return standardDate(new DateTime($date));
    }
}