Ext.define('Financial.view.main.internal.ManageCategories', {
    extend: 'Ext.window.Window',
    requires: 'Financial.view.main.internal.manageCategories.Grid',

    frame: true,
    title: 'Manage Categories',
    floating: true,
    draggable: false,
    closable: true,
    modal: true,
    resizable: false,
    width: '300px',
    height: '80%',
    closeAction: 'destroy',

    layout: 'fit',

    items: [
        {
            xtype: 'app-main-internal-manageCategories-grid'
        }
    ]
});