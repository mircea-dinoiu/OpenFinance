const path = require('path');
const moment = require('moment');
const fs = require('fs');

module.exports = {
    basePath(string = '') {
        return path.join(__dirname, '../../', string);
    },

    pickOwnProperties(source, keys) {
        const dest = {};

        keys.forEach((key) => {
            if (source.hasOwnProperty(key)) {
                dest[key] = source[key];
            }
        });

        return dest;
    },

    standardDate(value, format) {
        return moment(value, format).format('YYYY-MM-DD HH:mm:ss');
    },

    logError(...args) {
        console.error(...args);
        fs.appendFile(
            basePath('storage/error.log'),
            args.concat('').join('\n')
        );
    }
};
