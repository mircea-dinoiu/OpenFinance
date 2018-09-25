// @flow

export default (form) => {
    const date: Date = form.date.toDate();
    const time: Date = form.time.toDate();

    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    date.setSeconds(time.getSeconds());

    return {
        id: form.id,
        currency_id: form.currency,
        sum: form.sum,
        description: form.description,
        repeat: form.repeat,
        status: form.status || 'pending',
        created_at: parseInt(date.getTime() / 1000),
        user_id: form.userId,
        money_location_id: form.paymentMethod,
    };
};
