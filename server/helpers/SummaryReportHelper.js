const {uniq, sortBy} = require('lodash');
const {financialNum} = require('../../shared/utils/numbers');

const safeNum = financialNum;

module.exports = {
    description(text, {html} = {}) {
        if (html === 'false') {
            return text;
        }

        return `<span data-qtip="${text}">${text}</span>`;
    },

    safeNum,

    getUniques(records) {
        return uniq(
            records
                .filter((item) => item.isTotal !== true)
                .map((item) => item.reference),
        );
    },

    getRemainingSum(transactions, id) {
        let filteredTransactions;

        filteredTransactions = transactions.filter((t) => t.reference === id)[0];

        filteredTransactions = filteredTransactions
            ? filteredTransactions.sum
            : 0;

        return this.safeNum(-filteredTransactions);
    },

    formatMLName(id, {mlRecords}) {
        return mlRecords.find((each) => each.id == id).name;
    },

    addMLEntries({data, mls, mlRecords, html}) {
        const push = ({id, name, group, currencyId}) => {
            data.push({
                sum: mls[id],
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
                    group: record.type_id,
                    currencyId: record.currency_id,
                });
            }
        });
    },
};
