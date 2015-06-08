Ext.define('Financial.model.data.Report', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'sum', type: 'float'},
        {name: 'description', type: 'string'},
        {name: 'type', type: 'string'},
        {name: 'key', type: 'string'},
        {name: 'localKey', type: 'string'}
    ]
});