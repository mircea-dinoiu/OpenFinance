const express = require('express');
const router = express.Router();
const Controller = require('../controllers/ReportController');
const filters = require('../filters');

const c = new Controller();

router.get('/summary', filters.authProject, (req, res) => {
    res.wrapPromise(c.getSummary(req, res));
});

router.get('/balance-by-location', filters.authProject, (req, res) => {
    res.wrapPromise(c.getBalanceByLocation(req, res));
});

router.get('/expenses-by-location', filters.authProject, (req, res) => {
    res.wrapPromise(c.getExpensesByLocation(req, res));
});

module.exports = router;
