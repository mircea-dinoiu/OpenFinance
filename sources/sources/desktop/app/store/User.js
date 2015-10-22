Ext.define('Financial.store.User', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.User',

    storeId: 'user',

    proxy: {
        type: 'memory'
    },

    autoDestroy: false
});