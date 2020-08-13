const express = require('express');
const router = express.Router();
const Controller = require('../controllers/ExpenseController');
const SuggestionController = require('../controllers/SuggestionController');
const filters = require('../filters');
const fileupload = require('express-fileupload');
const {Expense} = require('../models');

const c = new Controller();
const sc = new SuggestionController();
const transactionsRepeat = require('./transactions/repeat');

router.get('/', filters.authProject, (req, res) => {
    res.wrapPromise(c.list(req, res));
});

router.delete('/', filters.authProject, async (req, res) => {
    res.wrapPromise(c.destroy(req, res));
});

router.put('/', filters.authProject, async (req, res) => {
    res.wrapPromise(c.update(req, res));
});

router.post('/', filters.authProject, async (req, res) => {
    res.wrapPromise(c.create(req, res));
});

router.post(
    '/detach',
    [
        filters.authProject,
        filters.validateBody({
            ids: ['isRequired', ['isIdArray', Expense]],
        }),
    ],
    async (req, res) => {
        res.wrapPromise(transactionsRepeat.detach({req, res}));
    },
);
router.post(
    '/skip',
    [
        filters.authProject,
        filters.validateBody({
            ids: ['isRequired', ['isIdArray', Expense]],
        }),
    ],
    async (req, res) => {
        res.wrapPromise(transactionsRepeat.skip({req, res}));
    },
);

router.post(
    '/upload',
    [filters.authProject, fileupload()],
    async (req, res) => {
        res.wrapPromise(c.upload({req, res}));
    },
);

router.get('/suggestions/categories', filters.authProject, async (req, res) => {
    res.wrapPromise(sc.getCategories(req, res));
});

router.get(
    '/suggestions/descriptions',
    filters.authProject,
    async (req, res) => {
        res.wrapPromise(sc.getExpenseDescriptions(req, res));
    },
);

module.exports = router;
