Ext.define('Financial.store.Income', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.Income',

    autoDestroy: true,

    groupField: 'user_id',

    proxy: {
        type: 'ajax',
        url: Financial.routes.income.list,
        reader: {
            type: 'json'
        }
    },

    autoLoad: false
});