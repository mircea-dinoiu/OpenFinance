Ext.define('Financial.view.main.internal.ManageMoneyLocations', {
    extend: 'Financial.view.main.internal.ManagerWindow',
    requires: 'Financial.view.main.internal.manageMoneyLocations.MoneyLocationsGrid',

    title: 'Manage Money Locations',

    items: [
        {
            xtype: 'app-main-internal-manageMoneyLocations-grid'
        }
    ]
});