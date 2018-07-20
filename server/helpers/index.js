const { standardDate } = require('../../shared/utils/dates');
const path = require('path');
const fs = require('fs');
const basePath = (string = '') => path.join(__dirname, '../../', string);
const config = require('config');

module.exports = {
    basePath,

    pickOwnProperties(source, keys) {
        const dest = {};

        keys.forEach((key) => {
            if (source.hasOwnProperty(key)) {
                dest[key] = source[key];
            }
        });

        return dest;
    },

    getScriptSrc(script) {
        const assetHost = config.get('devServer.enable')
            ? config.get('devServer.hostname')
            : '';
        const manifest = require('../../public/dist/manifest.json');

        return assetHost + manifest[script];
    },

    standardDate,

    logError(...args) {
        console.error(...args);
        fs.appendFile(
            basePath('storage/error.log'),
            args.concat('').join('\n'),
        );
    },
};
