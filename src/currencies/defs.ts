export type TCurrency = {
    id: number;
    iso_code: string;
};
export type TCurrencyMap = {
    [key: number]: TCurrency;
};
export type TCurrencies = {
    map: TCurrencyMap;
};
