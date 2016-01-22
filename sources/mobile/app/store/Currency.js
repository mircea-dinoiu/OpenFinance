Ext.define('Financial.store.CurrencyStore', {
    extend: 'Ext.data.Store',

    requires: 'Financial.model.CurrencyModel',

    config: {
        model: 'Financial.model.CurrencyModel',

        storeId: 'currency',

        proxy: {
            type: 'memory'
        },

        autoDestroy: false
    }
});