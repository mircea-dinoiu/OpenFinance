Ext.define('Financial.util.Category', {
    singleton: true,

    getCategoryById: function (id) {
        var store = this.getStore();

        return store.getAt(store.findExact('id', parseInt(id)));
    },

    getStore: function () {
        return Financial.data.category.store;
    }
});