// @flow

export const makeUrl = (path: string, params: {} = {}): string => {
    const urlObj = new URL(path, window.location.origin);

    urlObj.search = new URLSearchParams(params).toString();

    return urlObj.toString();
};
