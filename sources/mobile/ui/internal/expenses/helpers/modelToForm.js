import moment from 'moment';
import { arrToCsv } from 'common/transformers';

export default (model) => ({
    id: model.id,
    sum: model.sum,
    description: model.item,
    date: moment(model.created_at),
    categories: arrToCsv(model.categories),
    paymentMethod: model.money_location_id,
    repeat: model.repeat,
    repeatOccurrences: model.repeat_occurrences,
    chargedPersons: arrToCsv(model.users),
    status: model.status || 'pending',
});
