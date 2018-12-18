import { arrToCsv } from 'common/transformers';
import moment from 'moment';

export default function (data) {
    return {
        currency: data.currencies.default,
        description: '',
        notes: '',
        sum: '',
        paymentMethod: null,
        chargedPersons: arrToCsv([data.user.getIn(['current', 'id'])]),
        categories: '',
        repeat: null,
        date: moment(),
        time: moment(),
    };
}
