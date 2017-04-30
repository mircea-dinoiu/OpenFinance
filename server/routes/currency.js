const express = require('express');
const router = express.Router();
const Controller = require('../controllers/CurrencyController');
const filters = require('../filters');

// todo change to currency/list
router.get('/', filters.auth, async(req, res) => {
    const update = req.query.update === 'true';

    res.json(await Controller.getList({update}));
});

module.exports = router;
