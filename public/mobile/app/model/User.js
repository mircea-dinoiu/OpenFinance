Ext.define('Financial.model.User', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            {
                name: 'id',
                type: 'int'
            },
            {
                name: 'first_name',
                type: 'string'
            },
            {
                name: 'last_name',
                type: 'string'
            },
            {
                name: 'full_name',
                type: 'string'
            }
        ]
    }
});