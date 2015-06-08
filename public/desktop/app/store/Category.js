Ext.define('Financial.store.Category', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.Category',

    proxy: {
        type: 'memory'
    },

    sorters: [{
        property: 'expenses',
        direction: 'DESC'
    }],

    autoDestroy: false
});