Ext.define('Financial.data.Expense', {
    extend: 'Financial.data.AbstractData',

    requires: 'Financial.store.Expense',

    singleton: true,

    cache: {},

    storeId: 'expense',
    storeClass: 'Financial.store.Expense'
});