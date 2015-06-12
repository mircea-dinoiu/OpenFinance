Ext.define('Financial.util.Category', {
    extend: 'Financial.util.AbstractStoreUtil',

    singleton: true,
    cache: {},

    getStore: function () {
        return Financial.data.category.store;
    }
});