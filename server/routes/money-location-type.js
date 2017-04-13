const express = require('express');
const router = express.Router();
const Controller = require('../controllers/MLTypeController');
const filters = require('../filters');

router.get('/list', filters.auth, async (req, res) => {
    res.json(await Controller.getList());
});

module.exports = router;
