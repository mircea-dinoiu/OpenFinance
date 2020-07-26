import {TransactionForm, TransactionModel} from 'components/transactions/types';
import {TransactionStatus} from 'defs';
import {Bootstrap} from 'types';

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
        ...form,
        sum: (form.type === 'deposit' ? 1 : -1) * form.sum,
        item: form.description,
        // @ts-ignore
        created_at: form.date.toISOString(),
        money_location_id: form.paymentMethod,
        repeat_occurrences: form.repeatOccurrences,
        users,
        status: form.status || TransactionStatus.pending,
    };
};
