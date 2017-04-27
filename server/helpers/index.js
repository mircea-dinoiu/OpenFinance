const path = require('path');
const moment = require('moment');

module.exports = {
    basePath(string = '') {
        return path.join(__dirname, '../../', string);
    },

    pickOwnProperties(source, keys) {
        const dest = {};

        keys.forEach(key => {
            if (source.hasOwnProperty(key)) {
                dest[key] = source[key];
            }
        });

        return dest;
    },

    standardDate(value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
    }
};