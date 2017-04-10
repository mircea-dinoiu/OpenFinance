const express = require('express');
const router = express.Router();
const Controller = require('../controllers/MoneyLocationController');

router.get('/list', async (req, res) => {
    res.json(await Controller.getList());
});

module.exports = router;
