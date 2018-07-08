const { advanceRepeatDate } = require('../../shared/helpers/repeatedModels');
const moment = require('moment');

module.exports = {
    generateClones({ records, endDate, startDate }) {
        const ret = [];

        records.forEach((record) => {
            if (startDate == null || this.day(record) >= this.day(startDate)) {
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

    day(date) {
        return moment(date).format('YYYY-MM-DD');
    },

    getClonesFor({ record, endDate, startDate }) {
        const out = [];
        const day = this.day;

        if (record.repeat != null) {
            let repeats = 1;

            // eslint-disable-next-line no-constant-condition
            while (true) {
                const newObject = this.advanceRepeatDate(
                    record.toJSON(),
                    repeats,
                );

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
