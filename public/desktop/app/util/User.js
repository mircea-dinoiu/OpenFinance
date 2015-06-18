Ext.define('Financial.util.User', {
    extend: 'Financial.util.AbstractStoreUtil',

    singleton: true,
    cache: {},

    storeId: 'user',
    storeClass: 'Financial.store.User',

    getAllIds: function () {
        return Ext.Array.map(this.getStore().data.items, function (user) {
            return user.get('id');
        });
    }
});