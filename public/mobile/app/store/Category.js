Ext.define('Financial.store.Category', {
    extend: 'Ext.data.Store',

    requires: 'Financial.model.Category',

    config: {
        model: 'Financial.model.Category',

        proxy: {
            type: 'memory'
        },

        storeId: 'category',

        sorters: [{
            property: 'expenses',
            direction: 'DESC'
        }],

        autoDestroy: false
    }
});