Ext.define('Financial.store.Income', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.Income',

    groupField: 'user_id',

    autoLoad: false,
    autoDestroy: true,

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
    },

    listeners: {
        write: function(){
            Financial.app.getController('Data').syncReports();
        }
    }
});