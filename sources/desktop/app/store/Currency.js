Ext.define('Financial.store.Currency', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.Currency',

    storeId: 'currency',

    proxy: {
        type: 'memory'
    },

    autoDestroy: false
});