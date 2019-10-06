// @flow

export const mapUrlSearchParamsToObject = (params: URLSearchParams) => {
    const entries = params.entries();

    const result = {};

    for (const entry of entries) {
        // each 'entry' is a [key, value] tuple
        const [key, value] = entry;

        result[key] = value;
    }

    return result;
};
