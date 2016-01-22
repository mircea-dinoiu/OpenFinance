Ext.define('Financial.store.CategoryStore', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.CategoryModel',
    autoDestroy: false,
    storeId: 'category',

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
            read: Financial.routes.category.list,
            create: Financial.routes.category.create,
            update: Financial.routes.category.update
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            rootProperty: 'data',
            allowSingle: false
        }
    }
});