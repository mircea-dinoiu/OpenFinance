import {TransactionForm, TransactionModel, TransactionStatus} from 'transactions/defs';
import {Bootstrap} from 'users/defs';

export const formToModel = (
    form: TransactionForm,
    props: {
        user: Bootstrap;
    },
): TransactionModel => {
    const users = Object.keys(form.chargedPersons).length > 0 ? form.chargedPersons : {[props.user.current.id]: 100};

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
