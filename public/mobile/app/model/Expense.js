Ext.define('Financial.model.Expense', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'integer'},
        {name: 'item', type: 'string'}
    ]
});