// @flow weak
import {objectEntriesOfSameType} from 'common/utils/collection';
import extend from 'lodash/extend';

export default function flattenObject(object: {}, prefix: string = '') {
    const propName = prefix ? `${prefix}.` : '';
    const ret = {};

    objectEntriesOfSameType(object).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            ret[key] = JSON.stringify(value);
        } else if ('object' === typeof value) {
            extend(ret, flattenObject(value, propName + key));
        } else {
            ret[propName + key] = value;
        }
    });

    return ret;
}
