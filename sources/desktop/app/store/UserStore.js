Ext.define('Financial.store.UserStore', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.UserModel',

    storeId: 'user',

    proxy: {
        type: 'memory'
    },

    autoDestroy: false
});