export default function (data) {
    return {
        currency: data.currencies.get('default'),
        description: '',
        sum: '',
        paymentMethod: null,
        chargedPersons: [data.user.getIn(['current', 'id'])],
        categories: [],
        repeat: null,
        date: new Date(),
        time: new Date(),
    };
}
