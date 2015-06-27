Ext.define('Financial.data.Category', {
    extend: 'Financial.data.AbstractData',

    requires: 'Financial.store.Category',

    singleton: true,
    cache: {},

    storeId: 'category',
    storeClass: 'Financial.store.Category'
});