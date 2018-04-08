const {uniq, concat, sortBy} = require('lodash');

module.exports = {
    description(text, {html} = {}) {
        if (html === 'false') {
            return text;
        }

        return `<span data-qtip="${text}">${text}</span>`;
    },

    safeNum(num) {
        return Number(num.toFixed(2));
    },

    getUniques(expenses, incomes) {
        return uniq(concat(
            expenses,
            incomes
        ).filter((item) => {
            return item.isTotal !== true;
        }).map((item) => {
            return parseInt(item.reference);
        }));
    },

    getRemainingSum(expenses, incomes, id) {
        let filteredExpenses, filteredIncomes;

        filteredExpenses = expenses.filter((expense) => {
            return expense.reference === id;
        })[0];

        filteredIncomes = incomes.filter((income) => {
            return income.reference === id;
        })[0];

        filteredExpenses = filteredExpenses ? filteredExpenses.sum : 0;
        filteredIncomes = filteredIncomes ? filteredIncomes.sum : 0;

        return this.safeNum(filteredIncomes - filteredExpenses);
    },

    formatMLName(id, {mlRecords, html}) {
        if (id == 0) {
            const name = 'Unclassified';

            return html === 'false' ? name : `<i>${name}</i>`;
        }

        return mlRecords.find(each => each.id == id).name;
    },

    addMLEntries({data, mls, mlRecords, html}) {
        const push = (id, name, group) => {
            data.push({
                sum: mls[id],
                description: this.description(name, {html}),
                reference: id,
                group,
                index: id,
            });
        };

        if (mls['0']) {
            push(0, this.formatMLName(0, {mlRecords, html}));
        }

        sortBy(mlRecords, 'name').forEach(record => {
            const id = record.id;

            if (mls[id]) {
                push(id, record.name, record.type_id);
            }
        });
    },
};