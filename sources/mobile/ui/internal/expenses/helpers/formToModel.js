// @flow
export default (data, props) => {
    const users = data.chargedPersons.length
        ? data.chargedPersons
        : props.user
            .get('list')
            .map((each) => each.get('id'))
            .toArray();
    const date: Date = new Date(data.date.valueOf());
    const time: Date = data.time;

    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    date.setSeconds(time.getSeconds());

    return {
        id: data.id,
        currency_id: data.currency,
        sum: data.sum,
        item: data.description,
        created_at: parseInt(date.getTime() / 1000),
        categories: data.categories,
        money_location_id: data.paymentMethod,
        repeat: data.repeat,
        users,
        status: data.status || 'pending',
    };
};
