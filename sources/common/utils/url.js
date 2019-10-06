// @flow weak

export const makeUrl = (path: string, params: {} = {}): string => {
    const urlObj = new URL(path, location.origin);

    urlObj.search = new URLSearchParams(params).toString();

    return urlObj.toString();
};
