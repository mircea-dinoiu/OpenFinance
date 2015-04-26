<?php

class UserController extends BaseController
{
    public function read()
    {
        return Response::json(Auth::user());
    }

    public function login()
    {
        if (Request::isMethod('post')) {
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
                    return $this->read();
                } else {
                    return Response::json('Email and password don\'t match', 400);
                }
            } else {
                return Response::json('Invalid email or password entered', 400);
            }
        } else {
            return $this->layout->with('content', \View::make('desktop.login'));
        }
    }

    public function logout()
    {
        Auth::logout();
    }
}
