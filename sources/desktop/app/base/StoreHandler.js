Ext.define('Financial.base.StoreHandler', {
    getStore: function () {
        return Ext.StoreManager.lookup(this.storeId) || Ext.create(this.storeClass);
    },

    getById: function (id) {
        if (!this.cache) {
            this.cache = {};
        }

        if (!this.cache[id]) {
            var store = this.getStore();

            this.cache[id] = store.getAt(store.findExact('id', parseInt(id)));
        }

        return this.cache[id];
    }
});