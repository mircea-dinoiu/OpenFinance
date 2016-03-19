Ext.define('Financial.view.main.internal.ManageMLs', {
    extend: 'Financial.view.main.internal.ManagerWindow',
    requires: 'Financial.view.main.internal.manageMLs.MLsGrid',

    title: 'Manage Money Locations',

    items: [
        {
            xtype: 'app-main-internal-manageMLs-grid'
        }
    ]
});