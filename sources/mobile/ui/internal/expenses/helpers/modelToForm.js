import moment from 'moment';

export default (data) => ({
    id: data.id,
    currency: data.currency_id,
    sum: data.sum,
    description: data.item,
    date: moment(data.created_at).toDate(),
    time: moment(data.created_at).toDate(),
    categories: data.categories,
    paymentMethod: data.money_location_id,
    repeat: data.repeat,
    chargedPersons: data.users,
    status: data.status || 'pending',
});
