import cron from 'node-cron';
import {updateStocks} from './updateStocks';

export const setupCrons = () => {
    updateStocks();
    cron.schedule('*/10 * * * *', updateStocks);
};
