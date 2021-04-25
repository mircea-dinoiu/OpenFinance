const express = require('express');
const Controller = require('../controllers/StocksController');
const {validateAuth} = require('../middlewares');

module.exports = () => {
    const router = express.Router();
    const c = new Controller();

    router.get('/', validateAuth, async (req, res) => {
        c.list(req, res);
    });

    return router;
};
