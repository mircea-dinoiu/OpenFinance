import {TransactionModel} from 'components/transactions/types';
import {Currencies} from 'types';

export const getItemCurrencyISOCode = ({
    item,
    currencies,
}: {
    item: Pick<TransactionModel, 'money_location'>;
    currencies: Currencies;
}) => currencies[item.money_location.currency_id].iso_code;

