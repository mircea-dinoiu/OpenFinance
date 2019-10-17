const express = require('express');
const router = express.Router();
const Controller = require('../controllers/ExpenseController');
const filters = require('../filters');

router.get('/', filters.auth, (req, res) => {
    res.wrapPromise(Controller.list(req, res));
});

router.delete('/', filters.auth, async (req, res) => {
    res.wrapPromise(Controller.destroy(req, res));
});

router.put('/', filters.auth, async (req, res) => {
    res.wrapPromise(Controller.update(req, res));
});

router.post('/', filters.auth, async (req, res) => {
    res.wrapPromise(Controller.create(req, res));
});

module.exports = router;
