const moment = require('moment');
const {RepeatOption} = require('../defs');

const advanceRepeatDate = (obj, rawRepeats) => {
    const newObject = {...obj};
    const date = moment(newObject.created_at);
    const repeats = Number(rawRepeats) || 1;

    switch (newObject.repeat) {
        case RepeatOption.DAILY:
            date.add(repeats, 'day');
            break;
        case RepeatOption.WEEKLY:
            date.add(repeats, 'week');
            break;
        case RepeatOption.WEEK_2:
            date.add(2 * repeats, 'week');
            break;
        case RepeatOption.MONTHLY:
            date.add(repeats, 'month');
            break;
        case RepeatOption.MONTH_2:
            date.add(2 * repeats, 'month');
            break;
        case RepeatOption.MONTH_3:
            date.add(3 * repeats, 'month');
            break;
        case RepeatOption.YEARLY:
            date.add(repeats, 'year');
            break;
    }

    newObject.created_at = date;

    return newObject;
};

module.exports = { advanceRepeatDate };
