Ext.define('Financial.view.main.internal.Data', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-main-internal-data',

    layout: 'border',
    defaults: {
        split: true
    },
    items: [
        {
            title: 'Reports',
            region: 'west',
            width: '20%'
        },
        {
            title: 'Expenses',
            region: 'center'
        },
        {
            title: 'Incomings',
            region: 'east',
            width: '20%'
        }
    ]
});