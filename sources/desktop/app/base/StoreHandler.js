Ext.define('Financial.base.StoreHandler', {
    getStore: function () {
        return Ext.StoreManager.lookup(this.storeId) || Ext.create(this.storeClass);
    },

    getById: function (id) {
        var store = this.getStore();

        return store.getAt(store.findExact('id', parseInt(id)));
    }
});