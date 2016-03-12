Ext.define('Financial.view.main.internal.managerWindow.ManagerWindowGrid', {
    extend: 'Ext.grid.Panel',
    border: false,
    autoScroll: true,

    listeners: {
        beforedestroy: 'onBeforeDestroy',
        write: {
            element: 'store',
            fn: 'onStoreWrite'
        }
    },

    tbar: [
        {
            text: 'Add',
            iconCls: 'icon-folder_add',
            handler: 'addRecord'
        }
    ],

    plugins: [
        {
            ptype: 'rowediting',
            listeners: {
                beforeedit: 'onBeforeRowEditing',
                canceledit: 'onCancelRowEditing',
                edit: 'onRowEditing'
            }
        }
    ],

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