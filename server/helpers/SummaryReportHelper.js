const {uniq, sortBy} = require('lodash');
const {financialNum} = require('../../src/js/utils/numbers');

const safeNum = financialNum;

module.exports = {
    description(text, {html} = {}) {
        return text;
    },

    safeNum,

    getUniques(records) {
        return uniq(records.filter((item) => item.isTotal !== true).map((item) => item.reference));
    },

    getRemainingSum(transactions, id) {
        let filteredTransactions;

        filteredTransactions = transactions.filter((t) => t.reference === id)[0];

        filteredTransactions = filteredTransactions ? filteredTransactions.cashValue : 0;

        return this.safeNum(filteredTransactions);
    },

    addMLEntries({data, mls, mlRecords, html}) {
        const push = ({id, name, group, currencyId}) => {
            data.push({
                cashValue: mls[id],
                description: this.description(name, {html}),
                reference: id,
                group,
                currencyId,
                index: id,
            });
        };

        sortBy(mlRecords, 'name').forEach((record) => {
            const id = record.id;

            if (mls[id]) {
                push({
                    id,
                    name: record.name,
                    group: record.type,
                    currencyId: record.currency_id,
                });
            }
        });
    },
};
