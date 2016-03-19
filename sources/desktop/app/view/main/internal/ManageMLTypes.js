Ext.define('Financial.view.main.internal.ManageMLTypes', {
    extend: 'Financial.view.main.internal.ManagerWindow',
    requires: 'Financial.view.main.internal.manageMLTypes.MLTypesGrid',

    title: 'Manage Money Location Types',

    items: [
        {
            xtype: 'app-main-internal-manageMLTypes-grid'
        }
    ]
});