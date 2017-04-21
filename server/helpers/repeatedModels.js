const moment = require('moment');

module.exports = {
    generateClones({records, endDate}) {
        const ret = [];

        records.forEach((record) => {
            ret.push(record);

            if (record.repeat) {
                this.getClonesFor({
                    record: record,
                    endDate
                }).forEach(clone => {
                    ret.push(clone);
                });
            }
        });
        
        return ret;
    },

    day(date) {
        return moment(date).format('YYYY-MM-DD');
    },

    getClonesFor({record, endDate}) {
        const out = [];
        const day = this.day;

        if (record.repeat != null) {
            let repeats = 1;

            while (true) {
                const newObject = this.advanceRepeatDate(
                    record.toJSON(),
                    repeats
                );

                newObject.original = record.id;
                newObject.persist = false;

                delete newObject.id;

                if (day(newObject.created_at) > day(endDate)) {
                    break;
                } else {
                    out.push({
                        toJSON: () => newObject
                    });
                    repeats++;
                }
            }
        }

        return out;
    },

    advanceRepeatDate(obj, rawRepeats) {
        const newObject = Object.assign({}, obj);
        const date = new Date(newObject.created_at);
        const repeats = rawRepeats || 1;

        switch (newObject.repeat) {
            case 'd':
                date.setDate(date.getDate() + 1 * repeats);
                break;
            case 'w':
                date.setDate(date.getDate() + 7 * repeats);
                break;
            case 'm':
                date.setMonth(date.getMonth() + 1 * repeats);
                break;
            case 'y':
                date.setFullYear(date.getFullYear() + 1 * repeats);
                break;
        }

        newObject.created_at = moment(date).format('YYYY-MM-DD HH:mm:ss');

        return newObject;
    },
};