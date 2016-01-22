Ext.define('Financial.data.Income', {
    extend: 'Financial.data.AbstractData',

    requires: 'Financial.store.IncomeStore',

    singleton: true,

    cache: {},

    storeId: 'income',
    storeClass: 'Financial.store.IncomeStore'
});