Ext.define('Financial.view.main.internal.manageCategories.CategoriesGridController', {
    extend: 'Financial.base.GridViewController',

    alias: 'controller.app-main-internal-manageCategories-grid',

    onStoreWrite: function () {
        Ext.ComponentQuery.query('app-main-internal-data-expenses-grid')[0].store.fireEvent('refresh');
        Financial.app.getController('Data').syncReports();
    },

    onBeforeDestroy: function () {
        var grid = this.getView(),
            store = grid.getStore();

        /**
         * Restore the original sort
         */
        store.sort(store.config.sorters);
    }
});