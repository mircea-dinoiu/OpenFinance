import express from 'express';
import {CurrencyController} from '../controllers/CurrencyController';
import {validateAuth} from '../middlewares';

export const createCurrenciesRouter = () => {
    const router = express.Router();
    const c = new CurrencyController();

    router.get('/', validateAuth, async (req, res) => {
        c.list(req, res);
    });

    return router;
};
