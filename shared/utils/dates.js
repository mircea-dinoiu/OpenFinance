const moment = require('moment');

module.exports = {
    endOfDayToISOString: (date = Date.now()) => {
        const workingDate = new Date(date);

        workingDate.setHours(23, 59, 59, 999);

        return moment(workingDate).toISOString();
    },
};
