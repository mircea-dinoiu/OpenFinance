Ext.define('Financial.data.Category', {
    extend: 'Financial.data.AbstractData',

    requires: 'Financial.store.CategoryStore',

    singleton: true,
    cache: {},

    storeId: 'category',
    storeClass: 'Financial.store.CategoryStore'
});