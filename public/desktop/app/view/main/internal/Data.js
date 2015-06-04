Ext.define('Financial.view.main.internal.Data', {
    extend: 'Ext.panel.Panel',

    requires: 'Financial.view.main.internal.data.Expenses',

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
            collapsible: true
        },
        {
            title: 'Expenses',
            region: 'center',
            xtype: 'app-main-internal-data-expenses'
        },
        {
            title: 'Incomings',
            region: 'east',
            width: '20%',
            collapsible: true
        }
    ]
});