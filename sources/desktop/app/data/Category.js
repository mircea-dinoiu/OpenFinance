Ext.define('Financial.data.Category', {
    extend: 'Financial.base.StoreHandler',

    singleton: true,

    storeId: 'category',
    storeClass: 'Financial.store.CategoryStore'
});