Ext.define('Financial.util.Category', {
    extend: 'Financial.util.AbstractStoreUtil',

    singleton: true,
    cache: {},

    storeId: 'category',
    storeClass: 'Financial.store.Category'
});