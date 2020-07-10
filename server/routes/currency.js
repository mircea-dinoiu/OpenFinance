const express = require('express');
const router = express.Router();
const Controller = require('../controllers/CurrencyController');
const filters = require('../filters');

const c = new Controller();

router.get('/', filters.auth, async (req, res) => {
    res.wrapPromise(c.list(req, res));
});

module.exports = router;
