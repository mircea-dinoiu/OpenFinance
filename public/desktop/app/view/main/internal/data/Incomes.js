Ext.define('Financial.view.main.internal.data.Incomes', {
    extend: 'Ext.panel.Panel',

    requires: 'Financial.view.main.internal.data.incomes.Grid',

    xtype: 'app-main-internal-data-incomes',

    layout: 'fit',

    items: [
        {
            xtype: 'app-main-internal-data-incomes-grid'
        }
    ]
});