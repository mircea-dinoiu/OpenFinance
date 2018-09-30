const path = require('path');
const basePath = (string = '') => path.join(__dirname, '../../', string);
const config = require('config');
const Messages = require('../Messages');

const extractIdsFromModel = (model, key) => {
    const ids = model.dataValues[key];

    if (ids) {
        return ids.split(',').map(Number);
    }

    return [];
};

const sanitizeSorters = (rawSorters) => {
    let sorters = [{ id: 'created_at', desc: true }];

    if (rawSorters) {
        const parsed = JSON.parse(rawSorters);

        if (parsed.length) {
            sorters = parsed;
        }
    }

    return sorters;
};

const sanitizeFilters = (rawFilters) => {
    if (rawFilters) {
        return JSON.parse(rawFilters);
    }

    return [];
};

module.exports = {
    sanitizeFilters,
    sanitizeSorters,

    basePath,

    extractIdsFromModel,

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

    wrapPromise(promise) {
        promise.catch((e) => {
            console.error(e);
            this.status(500);
            this.json(Messages.ERROR_UNEXPECTED);
        });

        return promise;
    },
};
