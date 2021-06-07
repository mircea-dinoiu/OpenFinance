import express from 'express';
import {validateAdmin} from '../middlewares';
import {backfillStockPrices} from './backfillStockPrices';

export const createAdminRouter = () => {
    const router = express.Router();

    router.post('/backfill-stock-prices', validateAdmin, async (req, res) => {
        backfillStockPrices(req, res);
    });

    return router;
};
