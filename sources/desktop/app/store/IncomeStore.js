Ext.define('Financial.store.IncomeStore', {
    extend: 'Financial.store.BaseRepeatStore',

    model: 'Financial.model.IncomeModel',

    autoLoad: false,
    autoDestroy: false,
    storeId: 'income',

    sorters: [
        {
            property: 'created_at',
            direction: 'DESC'
        },
        {
            property: 'id',
            direction: 'DESC'
        }
    ],

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
            rootProperty: 'data',
            allowSingle: false
        }
    }
});