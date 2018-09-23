const { advanceRepeatDate } = require('../../shared/helpers/repeatedModels');
const moment = require('moment');

const day = (date) => moment(date).format('YYYY-MM-DD');

module.exports = {
    generateClones({ records, endDate, startDate }) {
        const ret = [];

        records.forEach((record) => {
            if (startDate == null || day(record) >= day(startDate)) {
                ret.push(record);
            }

            if (record.repeat) {
                this.getClonesFor({
                    record,
                    endDate,
                    startDate,
                }).forEach((clone) => {
                    ret.push(clone);
                });
            }
        });

        return ret;
    },

    day,

    getClonesFor({ record, endDate, startDate }) {
        const out = [];
        const recordAsJSON = record.toJSON();

        if (record.repeat != null) {
            let repeats = 1;

            // eslint-disable-next-line no-constant-condition
            while (true) {
                if (
                    record.repeat_occurrences &&
                    repeats > record.repeat_occurrences - 1
                ) {
                    break;
                }

                const newObject = this.advanceRepeatDate(recordAsJSON, repeats);

                if (startDate && day(newObject.created_at) < day(startDate)) {
                    repeats++;
                    continue;
                }

                newObject.original = record.id;
                newObject.persist = false;

                delete newObject.id;

                if (day(newObject.created_at) > day(endDate)) {
                    break;
                } else {
                    out.push(
                        Object.assign(
                            {
                                toJSON: () => newObject,
                            },
                            newObject,
                        ),
                    );
                    repeats++;
                }
            }
        }

        return out;
    },

    advanceRepeatDate,
};
