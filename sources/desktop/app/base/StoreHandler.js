Ext.define('Financial.base.StoreHandler', {
    getStore: function () {
        var store = Ext.StoreManager.lookup(this.storeId) || Ext.create(this.storeClass);

        if (store.handler == null) {
            store.handler = this;
        }

        return store;
    },

    getIndexById: function (id) {
        var store = this.getStore();

        return store.findExact('id', parseInt(id));
    },

    getById: function (id) {
        var store = this.getStore();

        return store.getAt(this.getIndexById(id));
    },

    getNameById: function (id) {
        if (id == 0) {
            return '<i>Unclassified</i>';
        }

        return this.getById(id).get('name');
    }
});