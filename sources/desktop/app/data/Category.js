Ext.define('Financial.data.Category', {
    extend: 'Financial.base.StoreHandler',

    singleton: true,
    cache: {},

    storeId: 'category',
    storeClass: 'Financial.store.Category'
});