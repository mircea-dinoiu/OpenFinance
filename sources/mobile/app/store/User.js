Ext.define('Financial.store.UserStore', {
    extend: 'Ext.data.Store',

    requires: 'Financial.model.UserModel',

    config: {
        model: 'Financial.model.UserModel',

        storeId: 'user',

        proxy: {
            type: 'memory'
        },

        autoDestroy: false
    }
});