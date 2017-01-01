export default (data) => {
    const date: Date = new Date(data.date.valueOf());
    const time: Date = data.time;

    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    date.setSeconds(time.getSeconds());

    return {
        id: data.id,
        sum: data.sum,
        description: data.description,
        repeat: data.repeat,
        status: data.status || 'pending',
        created_at: parseInt(date.getTime() / 1000),
        user_id: data.userId,
        money_location_id: data.paymentMethod
    };
};