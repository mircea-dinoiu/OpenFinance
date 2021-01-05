import {TransactionForm, TransactionModel} from 'components/transactions/types';
import {TransactionStatus} from 'defs';
import moment from 'moment';

export const modelToForm = (model: TransactionModel): TransactionForm => ({
    ...model,
    description: model.item,
    date: moment(model.created_at),
    categories: model.categories ?? [],
    paymentMethod: model.money_location_id,
    repeatOccurrences: model.repeat_occurrences,
    repeatFactor: model.repeat_factor,
    chargedPersons: model.users,
    status: model.status || TransactionStatus.pending,
    stockId: model.stock_id,
});
