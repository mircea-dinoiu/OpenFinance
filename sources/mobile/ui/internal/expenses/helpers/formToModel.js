// @flow

export default (form, props) => {
    const users =
        form.chargedPersons.length > 0
            ? form.chargedPersons
            : props.user
                .get('list')
                .map((each) => each.get('id'))
                .toArray();

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
        weight: form.weight,
        users,
        status: form.status || 'pending',
        type: form.type || 'withdrawal',
    };
};
