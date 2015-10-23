Ext.define('Financial.data.Income', {
    extend: 'Financial.data.AbstractData',

    requires: 'Financial.store.Income',

    singleton: true,

    cache: {},

    storeId: 'income',
    storeClass: 'Financial.store.Income'
});