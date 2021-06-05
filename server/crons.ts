import cron from 'node-cron';
import {updateStocks} from './stocks/crons';

export const setupCrons = () => {
    cron.schedule('*/15 * * * *', updateStocks);
};
