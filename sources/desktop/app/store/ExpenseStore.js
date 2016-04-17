Ext.define('Financial.store.ExpenseStore', {
    extend: 'Financial.store.BaseRepeatStore',

    model: 'Financial.model.ExpenseModel',

    autoLoad: false,
    autoDestroy: false,
    storeId: 'expense',

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
            type: 'json',
            transform: Financial.util.RepeatedModels.createTransformer('Financial.model.ExpenseModel')
        },
        api: {
            read: Financial.routes.expense.list,
            create: Financial.routes.expense.create,
            update: Financial.routes.expense.update,
            destroy: Financial.routes.expense.destroy
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            rootProperty: 'data',
            allowSingle: false
        }
    }
});