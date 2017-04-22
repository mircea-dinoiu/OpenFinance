const express = require('express');
const router = express.Router();
const Controller = require('../controllers/ReportController');
const filters = require('../filters');

router.get('/summary', filters.auth, (req, res) => {
    res.wrapPromise(Controller.getSummary(req, res));
});

router.get('/chart/expenses-by-category', filters.auth, (req, res) => {
    res.wrapPromise(Controller.getExpensesByCategoryChart(req, res));
});

router.get('/chart/expenses-incomes-by-user', filters.auth, (req, res) => {
    res.wrapPromise(Controller.getSummary(req, res));
});

module.exports = router;
