const express = require('express');
const router = express.Router();
const Controller = require('../controllers/MoneyLocationController');
const filters = require('../filters');

const c = new Controller();

router.get('/', filters.authProject, async (req, res) => {
    res.wrapPromise(c.list(req, res));
});

router.put('/', filters.authProject, (req, res) => {
    res.wrapPromise(c.update(req, res));
});

router.post('/', filters.authProject, (req, res) => {
    res.wrapPromise(c.create(req, res));
});

module.exports = router;
