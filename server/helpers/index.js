const { standardDate } = require('../../shared/utils/dates');
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

const mapInputToSorters = (input) => {
    let sorters = [{ id: 'created_at', desc: true }];

    if (input.sorters) {
        const parsed = JSON.parse(input.sorters);

        if (parsed.length) {
            sorters = parsed;
        }
    }

    return sorters;
};

const mapSortersToSQL = (sorters) => sorters
    .map((each) => `${each.id} ${each.desc ? 'DESC' : 'ASC'}`)
    .join(', ');

const mapInputToLimitOpts = (input) => {
    if (input.page != null && input.limit != null) {
        const offset = (input.page - 1) * input.limit;

        return { offset, limit: input.limit };
    }

    return null;
};

// https://github.com/sequelize/sequelize/issues/3007
const mapInputToLimitSQL = (input) => {
    const opts = mapInputToLimitOpts(input);

    if (opts != null) {
        return ` LIMIT ${opts.offset}, ${opts.limit}`;
    }

    return '';
};

module.exports = {
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

    standardDate,

    wrapPromise(promise) {
        promise.catch((e) => {
            console.error(e);
            this.status(500);
            this.json(Messages.ERROR_UNEXPECTED);
        });

        return promise;
    },

    mapSortersToSQL,
    mapInputToLimitSQL,
    mapInputToSorters,
};
