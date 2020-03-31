import moment from 'moment';
import {Users} from 'types';
import {TransactionStatus} from 'defs';

export const getFormDefaults = ({user}: {user: Users}) => {
    return {
        description: '',
        type: 'withdrawal',
        status: TransactionStatus.pending,
        sum: '',
        paymentMethod: user.current.preferred_money_location_id,
        chargedPersons: {[user.current.id]: 100},
        categories: '',
        repeat: null,
        date: moment(),
        time: moment(),
    };
};
