// @flow
import { csvToArr } from 'common/transformers';

export default (data, props) => {
    const users = data.chargedPersons
        ? csvToArr(data.chargedPersons).map(Number)
        : props.user
            .get('list')
            .map((each) => each.get('id'))
            .toArray();
    const date: Date = data.date.toDate();
    const time: Date = data.time.toDate();

    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    date.setSeconds(time.getSeconds());

    return {
        id: data.id,
        currency_id: data.currency,
        sum: data.sum,
        item: data.description,
        created_at: parseInt(date.getTime() / 1000),
        categories: csvToArr(data.categories).map(Number),
        money_location_id: data.paymentMethod,
        repeat: data.repeat,
        users,
        status: data.status || 'pending',
    };
};
