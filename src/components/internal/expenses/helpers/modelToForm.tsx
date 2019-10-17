import moment from 'moment';

export default (model) => ({
    id: model.id,
    sum: Math.abs(model.sum),
    description: model.item,
    notes: model.notes,
    favorite: model.favorite,
    hidden: model.hidden,
    date: moment(model.created_at),
    categories: model.categories,
    paymentMethod: model.money_location_id,
    repeat: model.repeat,
    repeatOccurrences: model.repeat_occurrences,
    weight: model.weight,
    chargedPersons: model.users,
    status: model.status || 'pending',
    type: model.sum < 0 ? 'withdrawal' : 'deposit',
});
