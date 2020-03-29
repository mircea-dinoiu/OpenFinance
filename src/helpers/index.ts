import {Currencies, TransactionModel} from 'types';

export const getItemCurrencyISOCode = ({
    item,
    currencies,
}: {
    item: TransactionModel;
    currencies: Currencies;
}) => currencies[item.money_location.currency_id].iso_code;
