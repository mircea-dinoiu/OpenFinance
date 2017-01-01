import 'whatwg-fetch';
import deepExtend from 'deep-extend';
import config from './config';

const globalNamespace = typeof self === 'undefined' ? this : self;

const parseOpts = (opts) => {
    return deepExtend({
        headers: {
            'X-CSRF-Token': config.csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'same-origin'
    }, opts);
};

export const fetch = async (url: string, opts: {} = {}, callback: ?Function = null) => {
    const parsedOpts = parseOpts(opts);

    if (parsedOpts.hasOwnProperty('body') && !parsedOpts.headers.hasOwnProperty('Content-Type')) {
        parsedOpts.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    }

    return globalNamespace.fetch(url, parsedOpts, callback);
};

export const fetchJSON = async (url: string, opts: {} = {}, callback: ?Function = null) => {
    const parsedOpts = parseOpts(opts);

    parsedOpts.headers['Content-Type'] = 'application/json';

    if ('object' === typeof parsedOpts.body) {
        parsedOpts.body = JSON.stringify(parsedOpts.body);
    }

    return globalNamespace.fetch(url, parsedOpts, callback);
};

export default fetch;

window._fetch = fetch;