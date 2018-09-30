// @flow
import { csvToArr } from 'common/transformers';
import moment from 'moment';

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
        sum: form.sum,
        item: form.description,
        created_at: moment(date).toISOString(),
        categories: csvToArr(form.categories).map(Number),
        money_location_id: form.paymentMethod,
        repeat: form.repeat,
        repeat_occurrences: form.repeatOccurrences,
        users,
        status: form.status || 'pending',
    };
};
