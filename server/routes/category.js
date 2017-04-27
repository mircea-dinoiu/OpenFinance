const express = require('express');
const router = express.Router();
const Controller = require('../controllers/CategoryController');
const filters = require('../filters');

router.get('/list', filters.auth, async (req, res) => {
    res.wrapPromise(Controller.getList(req, res));
});

router.post('/delete', filters.auth, (req, res) => {
    res.wrapPromise(Controller.postDelete(req, res));
});

router.post('/update', filters.auth, (req, res) => {
    res.wrapPromise(Controller.postUpdate(req, res));
});

router.post('/create', filters.auth, (req, res) => {
    res.wrapPromise(Controller.postCreate(req, res));
});

module.exports = router;
