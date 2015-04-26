<?php

class ExpenseController extends BaseController
{
    public function read() {
        return Response::json(Expense::orderBy('created_at', 'desc')->get());
    }
}
