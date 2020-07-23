import {TransactionStatus} from 'defs';
import moment from 'moment';
import {TransactionFormDefaults, Users} from 'types';

export const getFormDefaults = ({
    user,
}: {
    user: Users;
}): TransactionFormDefaults => {
    return {
        description: '',
        type: 'withdrawal',
        status: TransactionStatus.pending,
        sum: 0,
        paymentMethod: user.current.preferred_money_location_id,
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
