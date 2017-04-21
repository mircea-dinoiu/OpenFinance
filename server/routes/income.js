const express = require('express');
const router = express.Router();
const Controller = require('../controllers/IncomeController');
const filters = require('../filters');

router.get('/list', filters.auth, async (req, res) => {
    res.wrapPromise(Controller.getList(req, res));
});

router.post('/delete', filters.auth, async (req, res) => {
    res.wrapPromise(Controller.postDelete(req, res));
});

module.exports = router;
