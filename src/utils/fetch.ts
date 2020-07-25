import axios, {
    AxiosPromise,
    AxiosRequestConfig,
    AxiosResponse,
    CancelToken,
    CancelTokenSource,
} from 'axios';
import merge from 'lodash/merge';
import {useEffect, useRef, useState} from 'react';
import 'whatwg-fetch';
import {config} from './config';

const parseOpts = (opts: AxiosRequestConfig) =>
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

export const createXHR = <T>(opts: AxiosRequestConfig): AxiosPromise<T> => {
    const parsedOpts = parseOpts(opts);

    if (
        parsedOpts.hasOwnProperty('data') &&
        !parsedOpts.headers.hasOwnProperty('Content-Type')
    ) {
        if ('object' === typeof parsedOpts.data) {
            parsedOpts.data = JSON.stringify(parsedOpts.data);
            parsedOpts.headers['Content-Type'] = 'application/json';
        } else if ('string' === typeof parsedOpts.data) {
            parsedOpts.headers['Content-Type'] =
                'application/x-www-form-urlencoded; charset=UTF-8';
        }
    }

    return axios(parsedOpts);
};

export const useReader = <T>(
    opts: Omit<AxiosRequestConfig, 'cancelToken'> & {
        suspend?: boolean;
    },
): {
    response: AxiosResponse<T> | undefined;
    cancelSource: CancelTokenSource | null;
} => {
    const [response, setResponse] = useState<AxiosResponse<T> | undefined>();
    const cancelSource = useRef<CancelTokenSource>(null);

    useEffect(() => {
        if (opts.suspend) {
            return;
        }
        if (cancelSource.current) {
            cancelSource.current.cancel();
        }

        // @ts-ignore
        cancelSource.current = CancelToken.source();

        createXHR<T>({
            ...opts,
            cancelToken: cancelSource.current?.token,
        }).then((r) => setResponse(r));
    }, [JSON.stringify(opts)]);

    return {
        response,
        cancelSource: cancelSource.current,
    };
};

export type HttpMethod = 'DELETE' | 'PUT' | 'POST';
