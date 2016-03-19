Ext.define('Financial.model.data.ReportModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'sum', type: 'float'},
        {name: 'description', type: 'string'},
        {name: 'group'},
        {name: 'reference'},
        {name: 'isTotal', type: 'boolean', defaultValue: false}
    ]
});