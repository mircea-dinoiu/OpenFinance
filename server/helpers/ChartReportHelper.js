const moment = require('moment');

module.exports = {
    // eslint-disable-next-line max-params
    addToTimeMap(timeMap, dataKey, record, sum, timeFormat) {
        const timeDisplay = moment(record.created_at).format(
            timeFormat.display
        );
        const timeValue = moment(record.created_at).format(timeFormat.value);

        if (timeMap[timeValue] == null) {
            timeMap[timeValue] = {time: timeDisplay, sortField: timeValue};
        }

        if (timeMap[timeValue][dataKey] == null) {
            timeMap[timeValue][dataKey] = 0;
        }

        timeMap[timeValue][dataKey] += sum;
    },

    getTimeFormat(display) {
        let timeDisplayFormat;
        let timeValueFormat;

        switch (display) {
            case 'am':
                timeDisplayFormat = 'MMM YYYY'; // Jan 2005
                timeValueFormat = 'YYYY-MM'; // 2005-01
                break;
            case 'ay':
                timeDisplayFormat = 'YYYY'; // 2005
                timeValueFormat = 'YYYY'; // 2005
                break;
            case 'cm':
                timeDisplayFormat = 'ddd, D MMM'; // Mon, 1 Jan
                timeValueFormat = 'YYYY-MM-DD'; // 2005-01-01
                break;
        }

        return {
            display: timeDisplayFormat,
            value: timeValueFormat
        };
    },

    recordIsInRange(record, display) {
        switch (display) {
            case 'cm':
                {
                    const format = 'YYYY-MM'; // 2005-01

                    if (
                        moment(record.created_at).format(format) ===
                        moment(new Date()).format(format)
                    ) {
                        return true;
                    }
                }

                return false;
        }

        return true;
    }
};
