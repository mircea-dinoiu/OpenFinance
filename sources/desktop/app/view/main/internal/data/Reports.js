Ext.define('Financial.view.main.internal.data.Reports', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Financial.view.main.internal.data.reports.Calculations',
        'Financial.view.main.internal.data.reports.Categories'
    ],

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },

    autoScroll: true,

    xtype: 'app-main-internal-data-reports',

    items: [
        {
            xtype: 'app-main-internal-data-reports-calculations'
        },
        {
            xtype: 'app-main-internal-data-reports-categories'
        }
    ]
});