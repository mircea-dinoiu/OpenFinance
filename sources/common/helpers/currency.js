// @flow
export const findCurrencyById = (
    id: number | string,
    currencies: TypeCurrencies,
): TypeCurrency => currencies.map[id];

export const getBaseCurrency = (currencies: TypeCurrencies): TypeCurrency =>
    findCurrencyById(currencies.default, currencies);

export const getCurrencyByISOCode = (
    ISOCode: string,
    currencies: TypeCurrencies,
) => Object.values(currencies.map).find((each) => each.iso_code === ISOCode);

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
        from = findCurrencyById(from, currencies);
    } else if ('string' === typeof from) {
        from = getCurrencyByISOCode(from, currencies);
    }

    if (isFinite(to)) {
        to = findCurrencyById(to, currencies);
    } else if ('string' === typeof to) {
        to = getCurrencyByISOCode(to, currencies);
    }

    // $FlowFixMe from is currency map
    if (from.iso_code === to.iso_code) {
        return value;
    }

    // $FlowFixMe from is a currency map
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
