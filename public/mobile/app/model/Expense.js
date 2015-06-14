Ext.define('Financial.model.Expense', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            {name: 'id', type: 'int'},
            {name: 'sum', type: 'float', defaultValue: ''},
            {name: 'currency_id', type: 'int'},
            {name: 'item', type: 'string'},
            {name: 'created_at', type: 'date'},
            {name: 'status', type: 'string'}
        ]
    }
});