import {CurrencyMap, Currency, CurrencyIdentifier} from 'types';

export const findCurrencyById = (
    id: number,
    currencies: CurrencyMap,
): Currency => currencies[String(id)];

export const getCurrencyByISOCode = (
    ISOCode: string,
    currencies: CurrencyMap,
) => Object.values(currencies).find((each) => each.iso_code === ISOCode);

export const convertCurrency = ({
    value,
    from: rawFrom,
    to: rawTo,
    currencies,
}: {
    value: number;
    from: CurrencyIdentifier;
    to: CurrencyIdentifier;
    currencies: CurrencyMap;
}) => {
    let from = rawFrom;
    let to = rawTo;

    // @ts-ignore
    if (isFinite(from)) {
        // @ts-ignore
        from = findCurrencyById(from, currencies);
    } else if ('string' === typeof from) {
        // @ts-ignore
        from = getCurrencyByISOCode(from, currencies);
    }

    // @ts-ignore
    if (isFinite(to)) {
        // @ts-ignore
        to = findCurrencyById(to, currencies);
    } else if ('string' === typeof to) {
        // @ts-ignore
        to = getCurrencyByISOCode(to, currencies);
    }

    // @ts-ignore
    if (from.iso_code === to.iso_code) {
        return value;
    }

    // @ts-ignore
    return value * from.rates[to.iso_code];
};
