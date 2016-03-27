Ext.define('Financial.data.Expense', {
    extend: 'Financial.base.StoreHandler',

    singleton: true,

    storeId: 'expense',
    storeClass: 'Financial.store.ExpenseStore'
});