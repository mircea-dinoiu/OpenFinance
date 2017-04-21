const express = require('express');
const router = express.Router();
const Controller = require('../controllers/CategoryController');
const filters = require('../filters');

router.get('/list', filters.auth, async (req, res) => {
    res.json(await res.wrapPromise(Controller.getList()));
});

router.post('/delete', filters.auth, (req, res) => {
    res.wrapPromise(Controller.postDelete(req, res));
});

module.exports = router;
