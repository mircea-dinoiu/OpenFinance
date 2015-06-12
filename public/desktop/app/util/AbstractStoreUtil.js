Ext.define('Financial.util.AbstractStoreUtil', {
    getById: function (id) {
        if (!this.cache[id]) {
            var store = this.getStore();

            this.cache[id] = store.getAt(store.findExact('id', parseInt(id)));
        }

        return this.cache[id];
    }
});