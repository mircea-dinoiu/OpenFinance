Ext.define('Financial.view.main.internal.Data', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Financial.view.main.internal.data.Expenses',
        'Financial.view.main.internal.data.Incomes',
        'Financial.view.main.internal.data.Reports'
    ],

    xtype: 'app-main-internal-data',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    items: [
        {
            title: 'Reports',
            minWidth: 250,
            width: 250,
            xtype: 'app-main-internal-data-reports'
        },
        {
            width: 10,
            bodyStyle: 'background: #EEEEEE;'
        },
        {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            flex: 1,
            defaults: {
                collapsible: true,
                flex: 1
            },
            items: [
                {
                    title: 'Expenses',
                    xtype: 'app-main-internal-data-expenses'
                },
                {
                    height: 10,
                    flex: 0,
                    collapsible: false,
                    bodyStyle: 'background: #EEEEEE;'
                },
                {
                    title: 'Incomes',
                    xtype: 'app-main-internal-data-incomes',
                    collapseDirection: 'bottom'
                }
            ]
        }
    ]
});