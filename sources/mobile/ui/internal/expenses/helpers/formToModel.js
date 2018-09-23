// @flow
import { csvToArr } from 'common/transformers';

export default (form, props) => {
    const users = form.chargedPersons
        ? csvToArr(form.chargedPersons).map(Number)
        : props.user
            .get('list')
            .map((each) => each.get('id'))
            .toArray();
    const date: Date = form.date.toDate();
    const time: Date = form.time.toDate();

    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    date.setSeconds(time.getSeconds());

    return {
        id: form.id,
        currency_id: form.currency,
        sum: form.sum,
        item: form.description,
        created_at: parseInt(date.getTime() / 1000),
        categories: csvToArr(form.categories).map(Number),
        money_location_id: form.paymentMethod,
        repeat: form.repeat,
        repeat_occurrences: form.repeatOccurrences,
        users,
        status: form.status || 'pending',
    };
};
