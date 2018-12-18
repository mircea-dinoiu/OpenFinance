// @flow
import { csvToArr } from 'common/transformers';

export default (form, props) => {
    const users = form.chargedPersons
        ? csvToArr(form.chargedPersons).map(Number)
        : props.user
            .get('list')
            .map((each) => each.get('id'))
            .toArray();

    return {
        id: form.id,
        sum: form.sum,
        item: form.description,
        notes: form.notes,
        created_at: form.date.toISOString(),
        categories: csvToArr(form.categories).map(Number),
        money_location_id: form.paymentMethod,
        repeat: form.repeat,
        repeat_occurrences: form.repeatOccurrences,
        users,
        status: form.status || 'pending',
    };
};
