Ext.define('Financial.store.data.ReportStore', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.data.ReportModel',

    groupField: 'group',

    proxy: {
        type: 'memory'
    }
});