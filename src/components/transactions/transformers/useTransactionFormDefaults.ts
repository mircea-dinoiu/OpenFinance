import {TransactionForm} from 'components/transactions/types';
import {TransactionStatus} from 'defs';
import moment from 'moment';
import {useAccounts} from 'state/accounts';
import {useBootstrap} from 'state/hooks';

export const useTransactionFormDefaults = (): TransactionForm => {
    const user = useBootstrap();
    const mls = useAccounts();

    return {
        description: '',
        notes: '',
        status: TransactionStatus.pending,
        price: 0,
        quantity: 1,
        paymentMethod: mls[0]?.id,
        chargedPersons: {[user.current.id]: 100},
        categories: [],
        repeat: null,
        date: moment(),
        hidden: false,
        weight: null,
        favorite: 0,
        repeatOccurrences: 0,
        repeatFactor: 1,
        stockId: null,
    };
};
