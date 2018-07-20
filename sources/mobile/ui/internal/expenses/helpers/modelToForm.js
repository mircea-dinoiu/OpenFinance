import moment from 'moment';
import { arrToCsv } from 'common/transformers';

export default (data) => ({
    id: data.id,
    currency: data.currency_id,
    sum: data.sum,
    description: data.item,
    date: moment(data.created_at),
    time: moment(data.created_at),
    categories: arrToCsv(data.categories),
    paymentMethod: data.money_location_id,
    repeat: data.repeat,
    chargedPersons: arrToCsv(data.users),
    status: data.status || 'pending',
});
