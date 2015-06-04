Ext.define('Financial.view.main.internal.data.Expenses', {
    extend: 'Ext.panel.Panel',

    requires: 'Financial.view.main.internal.data.expenses.Grid',

    xtype: 'app-main-internal-data-expenses',

    layout: 'fit',

    items: [
        {
            xtype: 'app-main-internal-data-expenses-grid'
        }
    ]
});