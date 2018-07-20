// @flow
import 'whatwg-fetch';
import merge from 'lodash/merge';
import config from './config';
import flattenObject from 'common/utils/flattenObject';

const globalNamespace = typeof self === 'undefined' ? this : self;
const parseOpts = (opts) =>
    merge(
        {
            headers: {
                'X-CSRF-Token': config.csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
        },
        opts,
    );
const log = (data) => {
    if ('function' === typeof console.table) {
        console.table(flattenObject(data));
    } else {
        console.info('[fetch]', data);
    }
};

export const fetch = async (
    url: string,
    opts: {} = {},
    callback: ?Function = null,
) => {
    const parsedOpts = parseOpts(opts);

    if (
        parsedOpts.hasOwnProperty('body') &&
        !parsedOpts.headers.hasOwnProperty('Content-Type')
    ) {
        parsedOpts.headers['Content-Type'] =
            'application/x-www-form-urlencoded; charset=UTF-8';
    }

    log({ url, ...parsedOpts });

    return globalNamespace.fetch(url, parsedOpts, callback);
};

export const fetchJSON = async (
    url: string,
    opts: {} = {},
    callback: ?Function = null,
) => {
    const parsedOpts = parseOpts(opts);

    parsedOpts.headers['Content-Type'] = 'application/json';

    log({ url, ...parsedOpts });

    if ('object' === typeof parsedOpts.body) {
        parsedOpts.body = JSON.stringify(parsedOpts.body);
    }

    return globalNamespace.fetch(url, parsedOpts, callback);
};

export default fetch;
