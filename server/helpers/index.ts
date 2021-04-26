import path from 'path';
import {PERC_MAX} from '../../src/js/defs';

const basePath = (string = '') => path.join(__dirname, '../../', string);

const extractIdsFromModel = (model, key) => {
    const ids = model.dataValues[key];

    if (ids) {
        return ids.split(',').map(Number);
    }

    return [];
};

const extractUsersFromModel = (model) => {
    const pairs = model.dataValues.userBlameMap.split(',');

    return pairs
        .map((pair) => pair.split(':'))
        .reduce((acc, [key, value]) => {
            let workingValue = Number(value);

            // Support old style blame values (binary)
            if (workingValue === 1) {
                workingValue = PERC_MAX / pairs.length;
            }

            acc[key] = workingValue;

            return acc;
        }, {});
};

const sanitizeSorters = (rawSorters) => {
    let sorters = [{id: 'created_at', desc: true}];

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

const pickOwnProperties = (source, keys) => {
    const dest = {};

    keys.forEach((key) => {
        if (source.hasOwnProperty(key)) {
            dest[key] = source[key];
        }
    });

    return dest;
};

export {sanitizeFilters, pickOwnProperties, sanitizeSorters, basePath, extractIdsFromModel, extractUsersFromModel};
