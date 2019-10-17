const express = require('express');
const router = express.Router();
const Controller = require('../controllers/ReportController');
const filters = require('../filters');

router.get('/summary', filters.auth, (req, res) => {
    res.wrapPromise(Controller.getSummary(req, res));
});

router.get('/balance-by-location', filters.auth, (req, res) => {
    res.wrapPromise(Controller.getBalanceByLocation(req, res))
});

router.get('/expenses-by-location', filters.auth, (req, res) => {
    res.wrapPromise(Controller.getExpensesByLocation(req, res))
});

module.exports = router;
