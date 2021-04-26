import {TransactionModel} from 'transactions/defs';
import {TCurrency, TCurrencyMap} from 'currencies/defs';

export const findCurrencyById = (id: number, currencies: TCurrencyMap): TCurrency => currencies[String(id)];

export const getCurrencyByISOCode = (ISOCode: string, currencies: TCurrencyMap) =>
    Object.values(currencies).find((each) => each.iso_code === ISOCode);

export const getItemCurrencyISOCode = ({
    item,
    currencies,
}: {
    item: Pick<TransactionModel, 'money_location'>;
    currencies: TCurrencyMap;
}) => currencies[item.money_location.currency_id].iso_code;
