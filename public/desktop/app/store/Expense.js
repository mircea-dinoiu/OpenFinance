Ext.define('Financial.store.Expense', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.Expense',

    autoDestroy: true,
    autoLoad: false,

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
        write: function(){
            Financial.app.getController('Data').syncReports();
        }
    }
});