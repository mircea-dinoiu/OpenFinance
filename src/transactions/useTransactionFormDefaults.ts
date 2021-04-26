import {useAccounts} from 'accounts/state';
import moment from 'moment';
import {TransactionStatus} from 'transactions/defs';
import {useUser} from 'users/state';
import {TransactionForm} from './form';

export const useTransactionFormDefaults = (): TransactionForm => {
    const user = useUser();
    const mls = useAccounts();

    return {
        description: '',
        notes: '',
        status: TransactionStatus.pending,
        price: 0,
        quantity: -1,
        paymentMethod: mls[0]?.id,
        chargedPersons: {[user.id]: 100},
        categories: [],
        repeat: null,
        date: moment(),
        hidden: false,
        weight: null,
        favorite: 0,
        repeatOccurrences: null,
        repeatFactor: 1,
        stockId: null,
        inventoryId: null,
    };
};
