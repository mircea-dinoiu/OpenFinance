import {TransactionForm, TransactionStatus} from 'transactions/defs';
import {useBootstrap} from 'users/state';
import moment from 'moment';
import {useAccounts} from 'accounts/state';

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
        repeatOccurrences: null,
        repeatFactor: 1,
        stockId: null,
        inventoryId: null,
    };
};
