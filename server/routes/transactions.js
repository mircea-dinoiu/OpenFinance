const express = require('express');
const router = express.Router();
const Controller = require('../controllers/ExpenseController');
const filters = require('../filters');
const fileupload = require('express-fileupload');
const defs = require('../../src/js/defs');

const c = new Controller();
const transactionsRepeat = require('./transactions/repeat');
const {getExpenseDescriptions} = require('./transactions/suggestions');
const {getCategories} = require('./transactions/suggestions');

router.get('/', filters.authProject, (req, res) => {
    res.wrapPromise(c.list(req, res));
});

router.delete(
    '/',
    [
        filters.authProject,
        filters.validatePayload({
            ids: ['isRequired', 'isTransactionIdArray'],
        }),
    ],
    async (req, res) => {
        res.wrapPromise(c.destroy(req, res));
    },
);

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
        filters.validatePayload({
            ids: ['isRequired', 'isTransactionIdArray'],
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
        filters.validatePayload({
            ids: ['isRequired', 'isTransactionIdArray'],
        }),
    ],
    (req, res) => {
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

router.get(
    '/suggestions/categories',
    [
        filters.authProject,
        filters.validatePayload(
            {
                search: ['isString'],
                end_date: [
                    'isRequired',
                    ['isDateFormat', defs.FULL_DATE_FORMAT_TZ],
                ],
            },
            'query',
        ),
    ],
    (req, res) => {
        res.wrapPromise(getCategories(req, res));
    },
);

router.get('/suggestions/descriptions', filters.authProject, (req, res) => {
    res.wrapPromise(getExpenseDescriptions(req, res));
});

module.exports = router;
