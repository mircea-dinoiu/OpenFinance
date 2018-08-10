const moment = require('moment');
const chalk = require('chalk');
const fs = require('fs');
const { basePath } = require('./index');

module.exports = {
    log(label, ...args) {
        console.log(
            chalk.inverse(label),
            chalk.inverse(moment().format('MMMM Do YYYY, h:mm:ss a')),
            ...args,
        );
    },

    error(...args) {
        console.error(...args);
        fs.appendFile(
            basePath('storage/error.log'),
            args.concat('').join('\n'),
        );
    },
};
