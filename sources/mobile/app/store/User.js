Ext.define('Financial.store.User', {
    extend: 'Ext.data.Store',

    requires: 'Financial.model.User',

    config: {
        model: 'Financial.model.User',

        storeId: 'user',

        proxy: {
            type: 'memory'
        },

        autoDestroy: false
    }
});