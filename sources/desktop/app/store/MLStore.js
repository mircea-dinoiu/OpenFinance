Ext.define('Financial.store.MLStore', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.MLModel',
    autoDestroy: false,
    storeId: 'ml',

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
            read: Financial.routes.ml.list,
            create: Financial.routes.ml.create,
            update: Financial.routes.ml.update
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            rootProperty: 'data',
            allowSingle: false
        }
    }
});