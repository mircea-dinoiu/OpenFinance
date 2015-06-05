Ext.define('Financial.view.main.internal.data.Reports', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Financial.view.main.internal.data.reports.Calculations'
    ],

    xtype: 'app-main-internal-data-reports',

    layout: 'fit',

    items: [
        {
            xtype: 'app-main-internal-data-reports-calculations'
        },
        {
            title: 'Additional Info',
            //flex: 1
        }
    ]
});