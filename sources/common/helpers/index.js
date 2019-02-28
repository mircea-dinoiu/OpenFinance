// @flow

export const getItemCurrencyISOCode = ({
    item,
    currencies,
}) => {
    return currencies.map[item.money_location.currency_id].iso_code;
};
