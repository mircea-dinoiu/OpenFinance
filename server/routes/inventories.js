const express = require('express');
const Controller = require('../controllers/InventoryController');
const {validateAuth, validateProject, validatePayload} = require('../middlewares');
const {Inventory: Model} = require('../models');

module.exports = () => {
    const router = express.Router();
    const c = new Controller();

    router.get('/', [validateAuth, validateProject], async (req, res) => {
        c.list(req, res);
    });

    router.delete(
        '/',
        [
            validateAuth,
            validateProject,
            validatePayload({
                ids: ['isRequired', ['isIdArray', Model]],
            }),
        ],
        (req, res) => {
            // c.destroy(req, res);
        },
    );

    router.put('/', [validateAuth, validateProject], (req, res) => {
        // c.update(req, res);
    });

    router.post('/', [validateAuth, validateProject], (req, res) => {
        // c.create(req, res);
    });
    
    return router;
};
