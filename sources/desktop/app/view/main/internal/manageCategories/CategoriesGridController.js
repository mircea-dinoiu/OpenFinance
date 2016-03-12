Ext.define('Financial.view.main.internal.manageCategories.CategoriesGridController', {
    extend: 'Financial.view.main.internal.managerWindow.ManagerWindowGridController',

    alias: 'controller.app-main-internal-manageCategories-grid',

    onDeleteClick: function (a, b, c, e, event) {
        var record = event.record,
            store = record.store;

        Ext.Msg.show({
            title: 'Delete Category?',
            message: 'Are you sure you want to delete this category?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    store.remove(record);
                    store.sync();
                }
            }
        });
    },
});