Ext.define('Financial.store.CurrencyStore', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.CurrencyModel',

    storeId: 'currency',

    proxy: {
        type: 'memory'
    },

    autoDestroy: false
});