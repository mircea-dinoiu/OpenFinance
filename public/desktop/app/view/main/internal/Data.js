Ext.define('Financial.view.main.internal.Data', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Financial.view.main.internal.data.Expenses',
        'Financial.view.main.internal.data.Incomes',
        'Financial.view.main.internal.data.Reports'
    ],

    xtype: 'app-main-internal-data',

    layout: 'border',
    defaults: {
        split: true
    },
    items: [
        {
            title: 'Reports',
            region: 'west',
            width: '20%',
            collapsible: true,
            xtype: 'app-main-internal-data-reports'
        },
        {
            title: 'Expenses',
            region: 'center',
            xtype: 'app-main-internal-data-expenses'
        },
        {
            title: 'Incomes',
            region: 'east',
            width: '20%',
            collapsible: true,
            xtype: 'app-main-internal-data-incomes'
        }
    ]
});