const express = require('express');
const router = express.Router();
const Controller = require('../controllers/ReportController');
const {validateAuth, validateProject} = require('../middlewares');

const c = new Controller();

router.get('/summary', [validateAuth, validateProject], (req, res) => {
    res.wrapPromise(c.getSummary(req, res));
});

router.get(
    '/balance-by-location',
    [validateAuth, validateProject],
    (req, res) => {
        res.wrapPromise(c.getBalanceByLocation(req, res));
    },
);

module.exports = router;
