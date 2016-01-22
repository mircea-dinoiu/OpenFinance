Ext.define('Financial.data.Expense', {
    extend: 'Financial.data.AbstractData',

    requires: 'Financial.store.ExpenseStore',

    singleton: true,

    cache: {},

    storeId: 'expense',
    storeClass: 'Financial.store.ExpenseStore'
});