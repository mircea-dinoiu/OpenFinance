// @flow

export const csvToArr = (csv) => {
    if ('string' === typeof csv && csv) {
        return csv.split(',');
    }

    return [];
};

export const arrToCsv = (arr) => arr.join(',');
