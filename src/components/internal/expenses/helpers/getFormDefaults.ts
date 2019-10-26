import moment from 'moment';
import {TypeUsers} from 'types';

export const getFormDefaults = function(data: {user: TypeUsers}) {
    return {
        description: '',
        type: 'withdrawal',
        status: 'pending',
        sum: '',
        paymentMethod: null,
        chargedPersons: {[data.user.current.id]: 100},
        categories: '',
        repeat: null,
        date: moment(),
        time: moment(),
    };
};
