Ext.define('Financial.view.main.internal.managerWindow.ManagerWindowGridController', {
    extend: 'Financial.base.GridViewController',

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