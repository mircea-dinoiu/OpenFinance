Ext.define('Financial.store.Income', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.Income',

    autoLoad: false,
    autoDestroy: true,

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
    },

    listeners: {
        write: function(){
            Financial.app.getController('Data').syncReports();
        }
    }
});