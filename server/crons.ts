import cron from 'node-cron';
import {updateStocks} from './stocks/crons';

export const setupCrons = () => {
    if (process.env.CRONS === '1') {
        updateStocks();
        cron.schedule('*/15 * * * *', updateStocks);
    }
};
