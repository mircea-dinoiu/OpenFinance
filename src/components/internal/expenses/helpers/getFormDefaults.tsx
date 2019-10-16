import moment from 'moment';
import {TypeUsers} from 'types';

export default function(data: {user: TypeUsers}) {
    return {
        description: '',
        status: 'pending',
        notes: '',
        sum: '',
        paymentMethod: null,
        chargedPersons: {[data.user.current.id]: 100},
        categories: '',
        repeat: null,
        date: moment(),
        time: moment(),
    };
}
