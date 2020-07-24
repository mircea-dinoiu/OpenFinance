import {TransactionForm, TransactionModel, Bootstrap} from 'types';
import {TransactionStatus} from 'defs';

export const formToModel = (
    form: TransactionForm,
    props: {
        user: Bootstrap;
    },
): TransactionModel => {
    const users =
        Object.keys(form.chargedPersons).length > 0
            ? form.chargedPersons
            : {[props.user.current.id]: 100};

    return {
        id: form.id,
        sum: (form.type === 'deposit' ? 1 : -1) * form.sum,
        item: form.description,
        favorite: form.favorite,
        hidden: form.hidden,
        // @ts-ignore
        created_at: form.date.toISOString(),
        categories: form.categories,
        money_location_id: form.paymentMethod,
        repeat: form.repeat,
        repeat_occurrences: form.repeatOccurrences,
        weight: form.weight,
        users,
        status: form.status || TransactionStatus.pending,
    };
};
