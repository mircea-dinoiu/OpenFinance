const express = require('express');
const Controller = require('../controllers/ExpenseController');
const {validateAuth, validateProject, validatePayload} = require('../middlewares');
const fileupload = require('express-fileupload');
const transactionsRepeat = require('./transactions/repeat');
const {getExpenseDescriptions} = require('./transactions/suggestions');
const {getCategories} = require('./transactions/suggestions');

module.exports = () => {
    const router = express.Router();
    const c = new Controller();

    router.get('/', [validateAuth, validateProject], (req, res) => {
        c.list(req, res);
    });

    router.delete(
        '/',
        [
            validateAuth,
            validateProject,
            validatePayload({
                ids: ['isRequired', 'isTransactionIdArray'],
            }),
        ],
        async (req, res) => {
            c.destroy(req, res);
        },
    );

    router.put('/', [validateAuth, validateProject], async (req, res) => {
        c.update(req, res);
    });

    router.post('/', [validateAuth, validateProject], async (req, res) => {
        c.create(req, res);
    });

    router.post(
        '/detach',
        [
            validateAuth,
            validateProject,
            validatePayload({
                ids: ['isRequired', 'isTransactionIdArray'],
            }),
        ],
        async (req, res) => {
            transactionsRepeat.detach({req, res});
        },
    );
    router.post(
        '/skip',
        [
            validateAuth,
            validateProject,
            validatePayload({
                ids: ['isRequired', 'isTransactionIdArray'],
            }),
        ],
        (req, res) => {
            transactionsRepeat.skip({req, res});
        },
    );

    router.post('/upload', [validateAuth, validateProject, fileupload()], async (req, res) => {
        c.upload({req, res});
    });

    router.get(
        '/suggestions/categories',
        [
            validateAuth,
            validateProject,
            validatePayload(
                {
                    search: ['isString'],
                },
                'query',
            ),
        ],
        (req, res) => {
            getCategories(req, res);
        },
    );

    router.get(
        '/suggestions/descriptions',
        [
            validateAuth,
            validateProject,
            validatePayload(
                {
                    search: ['isString'],
                },
                'query',
            ),
        ],
        (req, res) => {
            getExpenseDescriptions(req, res);
        },
    );

    return router;
};
