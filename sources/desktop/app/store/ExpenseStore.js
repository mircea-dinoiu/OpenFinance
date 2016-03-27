Ext.define('Financial.store.ExpenseStore', {
    extend: 'Ext.data.Store',

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
            type: 'json'
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
    },

    listeners: {
        write: function () {
            Financial.app.getController('Data').syncReports();
        },
        filterchange: function () {
            Financial.app.getController('Data').syncReports();
        }
    }
});