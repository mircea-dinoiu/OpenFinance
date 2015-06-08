Ext.define('Financial.store.data.Report', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.data.Report',

    groupField: 'type',

    proxy: {
        type: 'memory'
    }
});