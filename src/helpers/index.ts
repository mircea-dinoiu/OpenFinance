import {TransactionModel} from 'components/transactions/types';
import {CurrencyMap} from 'types';

export const getItemCurrencyISOCode = ({
    item,
    currencies,
}: {
    item: Pick<TransactionModel, 'money_location'>;
    currencies: CurrencyMap;
}) => currencies[item.money_location.currency_id].iso_code;
