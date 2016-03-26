Ext.define('Financial.view.main.internal.managerWindow.ManagerWindowGridController', {
    extend: 'Financial.base.GridViewController',

    onStoreWrite: function () {
        Financial.data.Expense.getStore().fireEvent('refresh');
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