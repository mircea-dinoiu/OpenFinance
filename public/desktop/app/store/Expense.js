Ext.define('Financial.store.Expense', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.Expense',

    autoDestroy: true,

    proxy: {
        type: 'ajax',
        url: Financial.routes.expense.list,
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json',
            writeAllFields: false,  //just send changed fields
            allowSingle: false      //always wrap in an array
            // nameProperty: 'mapping'
        },
        api: {
            // read:
            create: 'task/bulkCreate.json',
            update: 'task/bulkUpdate.json'
            // destroy:
        }
    },

    autoLoad: false
});