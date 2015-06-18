Ext.define('Financial.store.Income', {
    extend: 'Ext.data.Store',

    requires: 'Financial.model.Income',

    config: {
        groupField: 'user_id',

        autoLoad: false,
        autoDestroy: true,

        model: 'Financial.model.Income',

        storeId: 'income',

        proxy: {
            type: 'ajax',
            reader: {
                type: 'json'
            },
            api: {
                read: Financial.routes.income.list,
                create: Financial.routes.income.create,
                update: Financial.routes.income.update,
                destroy: Financial.routes.income.destroy
            },
            writer: {
                type: 'json',
                writeAllFields: false,
                rootProperty: 'data'
            }
        }
    }
});