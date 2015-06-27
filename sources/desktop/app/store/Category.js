Ext.define('Financial.store.Category', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.Category',
    autoDestroy: false,
    storeId: 'category',

    sorters: [
        {
            property: 'expenses',
            direction: 'DESC'
        }
    ],

    proxy: {
        type: 'ajax',
        reader: {
            type: 'json'
        },
        api: {
            read: Financial.routes.category.list,
            create: Financial.routes.category.create,
            update: Financial.routes.category.update
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            rootProperty: 'data'
        }
    }
});