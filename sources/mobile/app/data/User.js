Ext.define('Financial.data.User', {
    extend: 'Financial.data.AbstractData',

    requires: 'Financial.store.UserStore',

    singleton: true,
    cache: {},

    storeId: 'user',
    storeClass: 'Financial.store.UserStore',

    getAllIds: function () {
        return Ext.Array.map(this.getStore().data.items, function (user) {
            return user.get('id');
        });
    }
});