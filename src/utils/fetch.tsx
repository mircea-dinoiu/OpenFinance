// @flow
import 'whatwg-fetch';
import merge from 'lodash/merge';
import config from './config';
import flattenObject from 'utils/flattenObject';
import axios from 'axios';

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

export const createXHR = <T,>(opts: {
    url: string,
    method?: string,
    data?: string | {},
    cancelToken?: {},
}): Promise<{
    data: T,
}> => {
    const parsedOpts = parseOpts(opts);

    if (
        parsedOpts.hasOwnProperty('data') &&
        !parsedOpts.headers.hasOwnProperty('Content-Type')
    ) {
        if ('object' === typeof parsedOpts.data) {
            parsedOpts.data = JSON.stringify(parsedOpts.data);
            parsedOpts.headers['Content-Type'] = 'application/json';
        } else {
            parsedOpts.headers['Content-Type'] =
                'application/x-www-form-urlencoded; charset=UTF-8';
        }
    }

    log(parsedOpts);

    return axios(parsedOpts);
};
