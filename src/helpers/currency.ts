import {TypeCurrencies, TypeCurrency, TypeCurrencyIdentifier} from 'types';
import {objectValuesOfSameType} from 'utils/collection';

export const findCurrencyById = (
    id: number,
    currencies: TypeCurrencies,
): TypeCurrency => currencies.map[String(id)];

export const getBaseCurrency = (currencies: TypeCurrencies): TypeCurrency =>
    findCurrencyById(currencies.default, currencies);

export const getCurrencyByISOCode = (
    ISOCode: string,
    currencies: TypeCurrencies,
) =>
    objectValuesOfSameType(currencies.map).find(
        (each) => each.iso_code === ISOCode,
    );

export const convertCurrency = ({
    value,
    from: rawFrom,
    to: rawTo,
    currencies,
}: {
    value: number;
    from: TypeCurrencyIdentifier;
    to: TypeCurrencyIdentifier;
    currencies: TypeCurrencies;
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

export const convertCurrencyToDefault = (
    value: number,
    from: TypeCurrencyIdentifier,
    currencies: TypeCurrencies,
) =>
    convertCurrency({
        value,
        from,
        to: getBaseCurrency(currencies),
        currencies,
    });
