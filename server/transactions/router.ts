import express from 'express';
import {ExpenseController} from './ExpenseController';
import {validateAuth, validateProject, validatePayload} from '../middlewares';
import fileupload from 'express-fileupload';
import {detachTransactions, skipTransactions} from './repeat';
import {getExpenseDescriptions, getCategories} from './suggestions';
import {getCalendar} from './calendar';

export const createTransactionsRouter = () => {
    const router = express.Router();
    const c = new ExpenseController();

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
            detachTransactions({req, res});
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
            skipTransactions({req, res});
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

    router.get(
        '/calendar',
        [
            validatePayload(
                {
                    email: ['isRequired', 'isString'],
                    password: ['isRequired', 'isString'],
                    year: ['isRequired', 'isInt'],
                    projectId: ['isRequired', 'isInt'],
                },
                'query',
            ),
        ],
        (req, res) => {
            getCalendar(req, res);
        },
    );

    return router;
};
