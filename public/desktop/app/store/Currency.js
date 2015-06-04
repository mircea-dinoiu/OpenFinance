Ext.define('Financial.store.Currency', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.Currency',

    proxy: {
        type: 'memory'
    },

    autoDestroy: false
});