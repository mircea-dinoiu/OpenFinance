import cron from 'node-cron';
import {updateStocks} from './stocks/crons';

export const setupCrons = () => {
    updateStocks();
    cron.schedule('*/10 * * * *', updateStocks);
};
