// @flow
import moment from 'moment';

export default function (data) {
    return {
        currency: data.currencies.default,
        description: '',
        type: 'withdrawal',
        status: 'pending',
        notes: '',
        sum: '',
        paymentMethod: null,
        chargedPersons: [data.user.getIn(['current', 'id'])],
        categories: '',
        repeat: null,
        date: moment(),
        time: moment(),
    };
}
