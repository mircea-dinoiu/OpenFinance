const { uniq, concat, sortBy } = require('lodash');
const { financialNum } = require('../../shared/utils/numbers');

const safeNum = financialNum;

module.exports = {
    description(text, { html } = {}) {
        if (html === 'false') {
            return text;
        }

        return `<span data-qtip="${text}">${text}</span>`;
    },

    safeNum,

    getUniques(expenses, incomes) {
        return uniq(
            concat(expenses, incomes)
                .filter((item) => item.isTotal !== true)
                .map((item) => item.reference),
        );
    },

    getRemainingSum(expenses, incomes, id) {
        let filteredExpenses;
        let filteredIncomes;

        filteredExpenses = expenses.filter(
            (expense) => expense.reference === id,
        )[0];

        filteredIncomes = incomes.filter((income) => income.reference === id)[0];

        filteredExpenses = filteredExpenses ? filteredExpenses.sum : 0;
        filteredIncomes = filteredIncomes ? filteredIncomes.sum : 0;

        return this.safeNum(filteredIncomes - filteredExpenses);
    },

    formatMLName(id, { mlRecords }) {
        return mlRecords.find((each) => each.id == id).name;
    },

    addMLEntries({ data, mls, mlRecords, html }) {
        const push = ({ id, name, group, currencyId }) => {
            data.push({
                sum: mls[id],
                description: this.description(name, { html }),
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
