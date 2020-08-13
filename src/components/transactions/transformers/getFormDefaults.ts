import {TransactionForm} from 'components/transactions/types';
import {TransactionStatus} from 'defs';
import moment from 'moment';
import {Accounts, Bootstrap} from 'types';

export const getFormDefaults = ({
    user,
    mls,
}: {
    user: Bootstrap;
    mls: Accounts;
}): TransactionForm => {
    return {
        description: '',
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
