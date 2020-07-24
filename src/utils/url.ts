import {useHistory, useLocation} from 'react-router-dom';

export const mapUrlToFragment = (url: URL) =>
    url.pathname + url.search + url.hash;

export const makeUrl = (path: string, params: {} = {}): string => {
    const urlObj = new URL(path, window.location.origin);

    urlObj.search = new URLSearchParams(params).toString();

    return mapUrlToFragment(urlObj);
};

export const useQueryParamState = <T extends string>(
    key: string,
    defaultValue: T,
): [T, (v: T) => void] => {
    const location = useLocation();
    const history = useHistory();

    return [
        (new URLSearchParams(location.search).get(key) ?? defaultValue) as T,
        (value) => {
            const url = new URL(window.location.href);

            url.searchParams.set(key, value);

            history.push(mapUrlToFragment(url));
        },
    ];
};
