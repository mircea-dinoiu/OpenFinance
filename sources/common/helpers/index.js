// @flow

export const getItemCurrencyISOCode = ({
    item,
    currencies,
    moneyLocations,
}) => {
    const currencyId = moneyLocations
        .toJSON()
        .find((each) => item.money_location_id === each.id).currency_id;

    return currencies.getIn(['map', String(currencyId), 'iso_code']);
};
