Ext.define('Financial.util.User', {
    singleton: true,

    getStore: function () {
        return Financial.data.user.store;
    },

    getUserById: function (id) {
        var store = this.getStore();

        return store.getAt(store.findExact('id', parseInt(id)));
    },

    getAllIds: function () {
        return Ext.Array.map(this.getStore().data.items, function (user) {
            return user.get('id');
        });
    }
});