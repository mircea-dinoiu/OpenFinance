Ext.define('Financial.model.Category', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'created_at', type: 'date'},
        {
            name: 'expenses',
            defaultValue: [],
            convert: function (expenses) {
                return expenses.length;
            }
        }
    ]
});