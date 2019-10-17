const express = require('express');
const router = express.Router();
const Controller = require('../controllers/CurrencyController');
const filters = require('../filters');

router.get('/', filters.auth, async (req, res) => {
    res.wrapPromise(Controller.list(req, res));
});

module.exports = router;
