Ext.define('Financial.data.Income', {
    extend: 'Financial.base.StoreHandler',

    singleton: true,

    storeId: 'income',
    storeClass: 'Financial.store.IncomeStore'
});