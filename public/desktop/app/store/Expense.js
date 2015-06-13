Ext.define('Financial.store.Expense', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.Expense',

    autoLoad: false,

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
            rootProperty: 'data'
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