Ext.define('Financial.data.AbstractData', {
    getStore: function () {
        return Ext.StoreManager.lookup(this.storeId) || Ext.create(this.storeClass);
    },

    getById: function (id) {
        if (!this.cache[id]) {
            var store = this.getStore();

            this.cache[id] = store.getAt(store.findExact('id', id.toString()));
        }

        return this.cache[id];
    }
});