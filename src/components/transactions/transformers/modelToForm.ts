import {TransactionForm, TransactionModel} from 'components/transactions/types';
import {TransactionStatus} from 'defs';
import moment from 'moment';

export const modelToForm = (model: TransactionModel): TransactionForm => ({
    ...model,
    sum: Math.abs(model.sum),
    description: model.item,
    date: moment(model.created_at),
    categories: model.categories ?? [],
    paymentMethod: model.money_location_id,
    repeatOccurrences: model.repeat_occurrences,
    chargedPersons: model.users,
    status: model.status || TransactionStatus.pending,
    type: model.sum < 0 ? 'withdrawal' : 'deposit',
});
