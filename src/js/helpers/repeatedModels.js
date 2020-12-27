const moment = require('moment');
const {RepeatOption} = require('../defs');

const advanceRepeatDate = (model, rawRepeats) => {
    const date = moment(model.created_at);
    const repeats = Number(rawRepeats) || 1;

    switch (model.repeat) {
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
        case RepeatOption.MONTHLY_TWICE:
            date.add(repeats * 15.21, 'day');
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

    return date;
};

module.exports = {advanceRepeatDate};
