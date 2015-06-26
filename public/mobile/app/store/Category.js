Ext.define('Financial.store.Category', {
    extend: 'Ext.data.Store',

    requires: 'Financial.model.Category',

    config: {
        model: 'Financial.model.Category',

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