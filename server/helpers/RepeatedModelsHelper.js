const { advanceRepeatDate } = require('../../shared/helpers/repeatedModels');
const { formatYMD } = require('../../shared/utils/dates');
const logger = require('../helpers/logger');
const { orderBy } = require('lodash');

const day = formatYMD;

module.exports = {
    filterClones(records, displayGenerated) {
        switch (displayGenerated) {
            case 'no':
                return records.filter((each) => each.persist !== false);
            case 'only':
                return records.filter((each) => each.persist === false);
            default:
                return records;
        }
    },

    generateClones({ records, endDate, startDate, sorters = [] }) {
        let ret = [];
        const start = Date.now();

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

        ret = orderBy(
            ret,
            sorters.map((each) => each.id),
            sorters.map((each) => (each.desc ? 'desc' : 'asc')),
        );

        logger.log('Generating clones took', Date.now() - start, 'millis');

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
                                dataValues: record.dataValues,
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
