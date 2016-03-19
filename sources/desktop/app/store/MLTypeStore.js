Ext.define('Financial.store.MLTypeStore', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.MLTypeModel',
    autoDestroy: false,
    storeId: 'mlType',

    sorters: [
        {
            property: 'name',
            direction: 'ASC'
        }
    ],

    proxy: {
        type: 'ajax',
        reader: {
            type: 'json'
        },
        api: {
            read: Financial.routes.mlType.list,
            create: Financial.routes.mlType.create,
            update: Financial.routes.mlType.update
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            rootProperty: 'data',
            allowSingle: false
        }
    }
});