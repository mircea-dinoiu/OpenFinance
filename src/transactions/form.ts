import {TransactionModel, TransactionStatus} from 'transactions/defs';
import {TUser} from 'users/defs';
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date';
import moment from 'moment';
import {RepeatOption} from './RepeatOption';

export type TransactionForm = {
    price: number;
    quantity: number;
    description: string;
    notes: string;
    favorite: number;
    hidden: boolean;
    paymentMethod: number;
    weight: number | null;
    date: MaterialUiPickersDate;
    chargedPersons: {
        [key: string]: number;
    };
    categories: number[];
    repeatOccurrences: number | null;
    repeatFactor: number;
    repeat: RepeatOption | null;
    status: TransactionStatus;
    stockId: number | null;
    inventoryId: number | null;
};
export const formToModel = (
    form: TransactionForm,
    props: {
        user: TUser;
    },
): TransactionModel => {
    const users = Object.keys(form.chargedPersons).length > 0 ? form.chargedPersons : {[props.user.id]: 100};

    return {
        ...form,
        item: form.description,
        // @ts-ignore
        created_at: form.date.toISOString(),
        money_location_id: form.paymentMethod,
        repeat_occurrences: form.repeatOccurrences,
        repeat_factor: form.repeatFactor,
        stock_id: form.stockId,
        inventory_id: form.inventoryId,
        users,
        status: form.status || TransactionStatus.pending,
    };
};
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
    inventoryId: model.inventory_id,
});
