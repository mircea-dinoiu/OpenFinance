// @flow
export const getById = (
    id: number | string,
    currencies: TypeCurrencies,
): TypeCurrency => currencies.getIn(['map', String(id)]);

export const getDefaultCurrency = (
    currencies: TypeCurrencies,
): TypeCurrency => getById(currencies.get('default'), currencies);

export const getCurrencyByISOCode = (ISOCode: string, currencies: TypeCurrencies) =>
    currencies.get('map').find((each) => each.get('iso_code') === ISOCode);

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
        from = getById(from, currencies);
    } else if ('string' === typeof from) {
        from = getCurrencyByISOCode(from, currencies);
    }

    if (isFinite(to)) {
        to = getById(to, currencies);
    } else if ('string' === typeof to) {
        to = getCurrencyByISOCode(to, currencies);
    }

    // $FlowFixMe from is currency map
    if (from.get('iso_code') === to.get('iso_code')) {
        return value;
    }

    // $FlowFixMe from is a currency map
    return value * from.getIn(['rates', to.get('iso_code')]);
};

export const convertCurrencyToDefault = (
    value: number,
    from: TypeCurrencyIdentifier,
    currencies: TypeCurrencies,
) =>
    convertCurrency({
        value,
        from,
        to: getDefaultCurrency(currencies),
        currencies,
    });
