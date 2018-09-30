// @flow
import moment from 'moment';

export default (form) => {
    const date: Date = form.date.toDate();
    const time: Date = form.time.toDate();

    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    date.setSeconds(time.getSeconds());

    return {
        id: form.id,
        sum: form.sum,
        description: form.description,
        repeat: form.repeat,
        status: form.status || 'pending',
        created_at: moment(date).toISOString(),
        user_id: form.userId,
        money_location_id: form.paymentMethod,
    };
};
