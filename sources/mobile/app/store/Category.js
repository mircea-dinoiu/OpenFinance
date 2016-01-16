Ext.define('Financial.store.CategoryStore', {
    extend: 'Ext.data.Store',

    requires: 'Financial.model.CategoryModel',

    config: {
        model: 'Financial.model.CategoryModel',

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
        },

        storeId: 'category',
        autoDestroy: false,

        sorters: [
            {
                property: 'expenses',
                direction: 'DESC'
            }
        ]
    }
});