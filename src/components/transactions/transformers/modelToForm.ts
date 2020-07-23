import moment from 'moment';
import {TransactionStatus} from 'defs';
import {TransactionForm, TransactionModel} from 'types';

export const modelToForm = (model: TransactionModel): TransactionForm => ({
    ...model,
    sum: Math.abs(model.sum),
    description: model.item,
    date: moment(model.created_at).toDate(),
    categories: model.categories,
    paymentMethod: model.money_location_id,
    repeatOccurrences: model.repeat_occurrences,
    chargedPersons: model.users,
    status: model.status || TransactionStatus.pending,
    type: model.sum < 0 ? 'withdrawal' : 'deposit',
});
