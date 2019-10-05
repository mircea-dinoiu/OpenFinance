// @flow weak
import queryString from 'query-string';

export default function url(rawUrl: string, params: {}): string {
    if (Object.keys(params).length) {
        return `${rawUrl}?${queryString.stringify(params)}`;
    }

    return rawUrl;
}
