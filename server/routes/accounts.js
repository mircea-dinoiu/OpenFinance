const express = require('express');
const Controller = require('../controllers/MoneyLocationController');
const {validateAuth, validateProject} = require('../middlewares');

module.exports = () => {
    const router = express.Router();
    const c = new Controller();

    router.get('/', [validateAuth, validateProject], async (req, res) => {
        c.list(req, res);
    });

    router.put('/', [validateAuth, validateProject], (req, res) => {
        c.update(req, res);
    });

    router.post('/', [validateAuth, validateProject], (req, res) => {
        c.create(req, res);
    });
    
    return router;
};
