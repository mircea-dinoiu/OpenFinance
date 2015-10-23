Ext.define('Financial.store.Currency', {
    extend: 'Ext.data.Store',

    requires: 'Financial.model.Currency',

    config: {
        model: 'Financial.model.Currency',

        storeId: 'currency',

        proxy: {
            type: 'memory'
        },

        autoDestroy: false
    }
});