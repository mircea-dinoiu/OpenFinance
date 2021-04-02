export type Currency = {
    id: number;
    iso_code: string;
};
export type CurrencyMap = {
    [key: number]: Currency;
};
export type Currencies = {
    map: CurrencyMap;
};
