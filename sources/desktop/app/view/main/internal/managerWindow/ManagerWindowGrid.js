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

    viewConfig: {
        listeners: {
            refresh: function (dataView) {
                Financial.util.Events.dataViewAutoFit(dataView);
            },
            scroll: function (dataView) {
                Financial.util.Events.dataViewAutoFit(dataView);
            }
        }
    },

    tbar: [
        {
            text: 'Add',
            iconCls: 'x-fa fa-plus-circle',
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
    ]
});