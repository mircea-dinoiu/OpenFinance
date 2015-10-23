Ext.define('Financial.model.Currency', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            {name: 'id', type: 'int'},
            {name: 'symbol', type: 'string'},
            {name: 'iso_code', type: 'string'},
            {name: 'currency', type: 'string'},
            {name: 'rates'}
        ]
    }
});