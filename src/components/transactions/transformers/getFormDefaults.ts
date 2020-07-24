import {TransactionStatus} from 'defs';
import moment from 'moment';
import {Accounts, TransactionFormDefaults, Bootstrap} from 'types';

export const getFormDefaults = ({
    user,
    mls,
}: {
    user: Bootstrap;
    mls: Accounts;
}): TransactionFormDefaults => {
    return {
        description: '',
        type: 'withdrawal',
        status: TransactionStatus.pending,
        sum: 0,
        paymentMethod: mls[0]?.id,
        chargedPersons: {[user.current.id]: 100},
        categories: [],
        repeat: null,
        date: moment().toDate(),
        hidden: false,
        weight: null,
        favorite: 0,
        repeatOccurrences: null,
    };
};
