import express from 'express';
import {StocksController} from '../controllers/StocksController';
import {validateAuth} from '../middlewares';

export const createStocksRouter = () => {
    const router = express.Router();
    const c = new StocksController();

    router.get('/', validateAuth, async (req, res) => {
        c.list(req, res);
    });

    return router;
};
