Ext.define('Financial.data.ML', {
    extend: 'Financial.base.StoreHandler',

    singleton: true,

    storeId: 'ml',
    storeClass: 'Financial.store.MLStore'
});