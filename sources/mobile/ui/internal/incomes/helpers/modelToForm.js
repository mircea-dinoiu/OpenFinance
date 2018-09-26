import moment from 'moment';

export default (model) => ({
    id: model.id,
    sum: model.sum,
    description: model.description,
    date: moment(model.created_at),
    time: moment(model.created_at),
    paymentMethod: model.money_location_id,
    repeat: model.repeat,
    userId: model.user_id,
    status: model.status || 'pending',
});
