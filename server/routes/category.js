const express = require('express');
const router = express.Router();
const Controller = require('../controllers/CategoryController');
const filters = require('../filters');
const {Category: Model} = require('../models');

const c = new Controller();

router.get('/', filters.authProject, async (req, res) => {
    res.wrapPromise(c.list(req, res));
});

router.delete(
    '/',
    [
        filters.authProject,
        filters.validateBody({
            ids: ['isRequired', ['isIdArray', Model]],
        }),
    ],
    (req, res) => {
        res.wrapPromise(c.destroy(req, res));
    },
);

router.put('/', filters.authProject, (req, res) => {
    res.wrapPromise(c.update(req, res));
});

router.post('/', filters.authProject, (req, res) => {
    res.wrapPromise(c.create(req, res));
});

module.exports = router;
