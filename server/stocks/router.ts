import express from 'express';
import {StocksController} from './controller';
import {validateAuth} from '../middlewares';

export const createStocksRouter = () => {
    const router = express.Router();
    const c = new StocksController();

    router.get('/', validateAuth, async (req, res) => {
        c.list(req, res);
    });

    router.post('/backfill-prices', validateAuth, async (req, res) => {
        c.backfillPrices(req, res);
    });

    return router;
};
