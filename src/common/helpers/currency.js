// @flow
import type {
    TypeCurrencies,
    TypeCurrency,
    TypeCurrencyIdentifier,
} from 'common/types';
import {objectValuesOfSameType} from 'common/utils/collection';

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
    value: number,
    from: TypeCurrencyIdentifier,
    to: TypeCurrencyIdentifier,
    currencies: TypeCurrencies,
}) => {
    let from = rawFrom;
    let to = rawTo;

    if (isFinite(from)) {
        // $FlowFixMe
        from = findCurrencyById(from, currencies);
    } else if ('string' === typeof from) {
        from = getCurrencyByISOCode(from, currencies);
    }

    if (isFinite(to)) {
        // $FlowFixMe
        to = findCurrencyById(to, currencies);
    } else if ('string' === typeof to) {
        to = getCurrencyByISOCode(to, currencies);
    }

    // $FlowFixMe
    if (from.iso_code === to.iso_code) {
        return value;
    }

    // $FlowFixMe
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