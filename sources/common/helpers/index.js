// @flow

export const getItemCurrencyISOCode = (item, currencies) =>
    currencies.getIn(['map', String(item.currency_id), 'iso_code']);
