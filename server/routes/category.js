const express = require('express');
const router = express.Router();
const Controller = require('../controllers/CategoryController');
const filters = require('../filters');

const c = new Controller();

router.get('/', filters.auth, async (req, res) => {
    res.wrapPromise(c.list(req, res));
});

router.delete('/', filters.auth, (req, res) => {
    res.wrapPromise(c.destroy(req, res));
});

router.put('/', filters.auth, (req, res) => {
    res.wrapPromise(c.update(req, res));
});

router.post('/', filters.auth, (req, res) => {
    res.wrapPromise(c.create(req, res));
});

module.exports = router;
