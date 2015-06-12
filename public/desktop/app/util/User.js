Ext.define('Financial.util.User', {
    extend: 'Financial.util.AbstractStoreUtil',

    singleton: true,
    cache: {},

    getStore: function () {
        return Financial.data.user.store;
    },

    getAllIds: function () {
        return Ext.Array.map(this.getStore().data.items, function (user) {
            return user.get('id');
        });
    }
});