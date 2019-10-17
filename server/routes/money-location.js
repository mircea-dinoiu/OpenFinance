const express = require('express');
const router = express.Router();
const Controller = require('../controllers/MoneyLocationController');
const filters = require('../filters');

router.get('/', filters.auth, async (req, res) => {
    res.wrapPromise(Controller.list(req, res));
});

router.put('/', filters.auth, (req, res) => {
    res.wrapPromise(Controller.update(req, res));
});

router.post('/', filters.auth, (req, res) => {
    res.wrapPromise(Controller.create(req, res));
});

module.exports = router;
