const moment = require('moment');
const advanceRepeatDate = (obj, rawRepeats) => {
    const newObject = Object.assign({}, obj);
    const date = new Date(newObject.created_at);
    const repeats = rawRepeats || 1;

    switch (newObject.repeat) {
        case 'd':
            date.setDate(date.getDate() + Number(repeats));
            break;
        case 'w':
            date.setDate(date.getDate() + 7 * repeats);
            break;
        case '2w':
            date.setDate(date.getDate() + 7 * 2 * repeats);
            break;
        case 'm':
            date.setMonth(date.getMonth() + Number(repeats));
            break;
        case '2m':
            date.setMonth(date.getMonth() + 2 * repeats);
            break;
        case '3m':
            date.setMonth(date.getMonth() + 3 * repeats);
            break;
        case 'y':
            date.setFullYear(date.getFullYear() + Number(repeats));
            break;
    }

    newObject.created_at = moment(date);

    return newObject;
};

module.exports = { advanceRepeatDate };
