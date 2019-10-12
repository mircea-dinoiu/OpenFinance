
import {TypeUsers} from 'types';

export default (
    form,
    props: {
        user: TypeUsers,
    },
) => {
    const users =
        Object.keys(form.chargedPersons).length > 0
            ? form.chargedPersons
            : {[props.user.current.id]: 100};

    return {
        id: form.id,
        sum: form.sum,
        item: form.description,
        notes: form.notes,
        favorite: form.favorite,
        hidden: form.hidden,
        created_at: form.date.toISOString(),
        categories: form.categories,
        money_location_id: form.paymentMethod,
        repeat: form.repeat,
        repeat_occurrences: form.repeatOccurrences,
        weight: form.weight === '' ? null : form.weight,
        users,
        status: form.status || 'pending',
        type: form.type || 'withdrawal',
    };
};
