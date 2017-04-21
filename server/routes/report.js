const express = require('express');
const router = express.Router();
const Controller = require('../controllers/ReportController');
const filters = require('../filters');

router.get('/', filters.auth, (req, res) => {
    res.wrapPromise(Controller.getList(req, res));
});

module.exports = router;
