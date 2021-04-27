import express from 'express';
import {AccountController} from './controller';
import {validateAuth, validateProject} from '../middlewares';

export const createAccountsRouter = () => {
    const router = express.Router();
    const c = new AccountController();

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
