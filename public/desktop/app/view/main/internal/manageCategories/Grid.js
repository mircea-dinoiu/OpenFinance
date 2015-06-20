Ext.define('Financial.view.main.internal.manageCategories.Grid', {
    extend: 'Ext.grid.Panel',

    xtype: 'app-main-internal-manageCategories-grid',

    requires: 'Financial.view.main.internal.manageCategories.GridController',

    controller: 'app-main-internal-manageCategories-grid',

    border: false,
    store: Financial.util.Category.getStore(),
    autoScroll: true,

    tbar: [
        {
            text: 'Add Category',
            iconCls: 'icon-folder_add',
            handler: 'onAddCategoryClick'
        }
    ],

    plugins: [
        {
            ptype: 'rowediting',
            listeners: {
                /*canceledit: 'onCancelRowEditing',
                 beforeedit: 'onBeforeRowEditing',
                 edit: 'onRowEditing'*/
            }
        }
    ],

    columns: [
        {
            header: 'Name',
            dataIndex: 'name',
            flex: 1,
            editor: {
                xtype: 'textfield',
                allowOnlyWhitespace: false
            }
        }
    ]
});