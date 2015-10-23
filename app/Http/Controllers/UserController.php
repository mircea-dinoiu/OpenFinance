<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function getList()
    {
        return Response::json([
            'current' => Auth::user(),
            'list' => User::all(),
        ]);
    }

    public function postLogin()
    {
        $rememberMe = (Input::get('remember_me') === 'true');

        $credentials = [
            'email' => Input::get('email'),
            'password' => Input::get('password')
        ];

        $validationRules = [
            'email' => 'required',
            'password' => 'required'
        ];

        $validator = Validator::make($credentials, $validationRules);

        if ($validator->passes()) {
            if (Auth::attempt(array_merge($credentials, ['deleted_at' => NULL]), $rememberMe)) {
                return $this->getList();
            } else {
                return Response::json('Email and password don\'t match', 400);
            }
        } else {
            return Response::json('Invalid email or password entered', 400);
        }
    }

    public function postLogout()
    {
        Auth::logout();

        if (Request::ajax()) {
            return Response::json();
        }

        return Redirect::to('/');
    }
}
