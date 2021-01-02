const moment = require('moment');
const {RepeatOption} = require('../defs');

const advanceRepeatDate = (model, rawRepeats) => {
    const date = moment(model.created_at);
    const repeatFactor = model.repeat_factor || 1;
    const repeats = Number(rawRepeats) || 1;

    switch (model.repeat) {
        case RepeatOption.DAY:
            date.add(repeatFactor * repeats, 'day');
            break;
        case RepeatOption.WEEK:
            date.add(repeatFactor * repeats, 'week');
            break;
        case RepeatOption.MONTH:
            date.add(repeatFactor * repeats, 'month');
            break;
        case RepeatOption.YEAR:
            date.add(repeatFactor * repeats, 'year');
            break;
    }

    return date;
};

module.exports = {advanceRepeatDate};
