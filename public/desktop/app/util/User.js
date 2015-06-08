Ext.define('Financial.util.User', {
    singleton: true,

    getUserById: function (id) {
        var store = Financial.data.user.store;

        return store.getAt(store.findExact('id', parseInt(id)));
    }
});