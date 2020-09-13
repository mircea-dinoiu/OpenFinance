const express = require('express');
const router = express.Router();
const Controller = require('../controllers/StocksController');
const {validateAuth} = require('../middlewares');

const c = new Controller();

router.get('/', validateAuth, async (req, res) => {
    c.list(req, res);
});

module.exports = router;
