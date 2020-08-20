import {TransactionForm} from 'components/transactions/types';
import {TransactionStatus} from 'defs';
import moment from 'moment';
import {useBootstrap, useMoneyLocations} from 'state/hooks';

export const useTransactionFormDefaults = (): TransactionForm => {
    const user = useBootstrap();
    const mls = useMoneyLocations();

    return {
        description: '',
        notes: '',
        status: TransactionStatus.pending,
        sum: 0,
        paymentMethod: mls[0]?.id,
        chargedPersons: {[user.current.id]: 100},
        categories: [],
        repeat: null,
        date: moment(),
        hidden: false,
        weight: null,
        favorite: 0,
        repeatOccurrences: 0,
    };
};