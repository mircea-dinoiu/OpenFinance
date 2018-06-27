import moment from 'moment';

export default (data) => ({
    id: data.id,
    currency: data.currency_id,
    sum: data.sum,
    description: data.description,
    date: moment(data.created_at).toDate(),
    time: moment(data.created_at).toDate(),
    paymentMethod: data.money_location_id,
    repeat: data.repeat,
    userId: data.user_id,
    status: data.status || 'pending'
});
