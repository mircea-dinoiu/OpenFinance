const express = require('express');
const router = express.Router();
const Controller = require('../controllers/CategoryController');
const {
    validateAuth,
    validateProject,
    validatePayload,
} = require('../middlewares');
const {Category: Model} = require('../models');

const c = new Controller();

router.get('/', [validateAuth, validateProject], async (req, res) => {
    res.wrapPromise(c.list(req, res));
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
        res.wrapPromise(c.destroy(req, res));
    },
);

router.put('/', [validateAuth, validateProject], (req, res) => {
    res.wrapPromise(c.update(req, res));
});

router.post('/', [validateAuth, validateProject], (req, res) => {
    res.wrapPromise(c.create(req, res));
});

module.exports = router;
