import moment from 'moment';
import chalk from 'chalk';
import fs from 'fs';
import {basePath} from './index';

export default {
    log(label, ...args) {
        console.log(chalk.inverse(label), chalk.inverse(moment().format('lll')), ...args);
    },

    error(...args) {
        console.error(...args);
        fs.appendFile(basePath('storage/error.log'), args.concat('').join('\n'), () => {});
    },
};
