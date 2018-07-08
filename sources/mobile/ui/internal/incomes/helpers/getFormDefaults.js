export default function (data) {
    return {
        currency: data.currencies.get('default'),
        description: '',
        sum: '',
        paymentMethod: null,
        userId: data.user.getIn(['current', 'id']),
        repeat: null,
        date: new Date(),
        time: new Date(),
    };
}
