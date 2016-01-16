Ext.define('Financial.model.data.ReportModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'sum', type: 'float'},
        {name: 'description', type: 'string'},
        {name: 'type', type: 'string'},
        {name: 'localKey'},
        {name: 'hasChildren', type: 'boolean', defaultValue: false},
        {name: 'parent', defaultValue: false},
        {name: 'display', type: 'boolean', defaultValue: true}
    ]
});