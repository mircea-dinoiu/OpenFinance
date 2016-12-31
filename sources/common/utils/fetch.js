import 'whatwg-fetch';
import deepExtend from 'deep-extend';
import config from './config';

const globalNamespace = typeof self === 'undefined' ? this : self;

export const fetch = async (url: string, opts: {} = {}, callback: ?Function = null) => {
    const parsedOpts = deepExtend({
        headers: {
            'X-CSRF-Token': config.csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'same-origin'
    }, opts);

    if (parsedOpts.hasOwnProperty('body') && !parsedOpts.headers.hasOwnProperty('Content-Type')) {
        parsedOpts.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    }

    return globalNamespace.fetch(url, parsedOpts, callback);
};

export default fetch;

window._fetch = fetch;