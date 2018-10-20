// @flow

export default (form) => {
    return {
        id: form.id,
        sum: form.sum,
        description: form.description,
        repeat: form.repeat,
        status: form.status || 'pending',
        created_at: form.date.toISOString(),
        user_id: form.userId,
        money_location_id: form.paymentMethod,
    };
};
