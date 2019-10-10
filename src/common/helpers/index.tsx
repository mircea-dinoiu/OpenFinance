// @flow

import {TypeTransactionModel, TypeCurrencies} from 'common/types';

export const getItemCurrencyISOCode = ({
    item,
    currencies,
}: {
    item: TypeTransactionModel,
    currencies: TypeCurrencies,
}) => currencies.map[String(item.money_location.currency_id)].iso_code;
