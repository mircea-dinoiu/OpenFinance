const express = require('express');
const router = express.Router();
const Controller = require('../controllers/CategoryController');
const filters = require('../filters');

router.get('/list', filters.auth, async (req, res) => {
    res.wrapPromise(Controller.list(req, res));
});

router.post('/delete', filters.auth, (req, res) => {
    res.wrapPromise(Controller.destroy(req, res));
});

router.post('/update', filters.auth, (req, res) => {
    res.wrapPromise(Controller.update(req, res));
});

router.post('/create', filters.auth, (req, res) => {
    res.wrapPromise(Controller.create(req, res));
});

module.exports = router;
