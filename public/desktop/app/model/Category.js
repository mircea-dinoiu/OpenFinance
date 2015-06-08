Ext.define('Financial.model.Category', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {
            name: 'expenses',
            convert: function (expenses) {
                return expenses.length;
            }
        }
    ]
});