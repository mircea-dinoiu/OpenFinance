// @flow

export const objectEntriesOfSameType = <T,>(obj: {
    [key: string]: T;
}): Array<[string, T]> => {
    return Object.entries(obj);
};

export const objectValuesOfSameType = <T,>(obj: {
    [key: string]: T;
}): Array<T> => {
    return Object.values(obj);
};
