const express = require('express');
const router = express.Router();
const Controller = require('../controllers/CurrencyController');
const filters = require('../filters');

// todo change to currency/list
router.get('/', filters.auth, async(req, res) => {
    res.wrapPromise(Controller.getList(req, res));
});

module.exports = router;
