Ext.define('Financial.view.main.internal.Charts', {
    extend: 'Ext.tab.Panel',

    requires: [
        'Financial.view.main.internal.charts.EBCChartPanel',
        'Financial.view.main.internal.charts.EIChartPanel'
    ],

    xtype: 'app-main-internal-charts',

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },

    defaults: {
        height: '100%'
    },

    items: [
        {
            title: 'Expenses by Category',
            xtype: 'app-main-internal-charts-ebcChartPanel'
        },
        {
            title: 'Expenses & Incomes by User',
            xtype: 'app-main-internal-charts-eiChartPanel'
        }
    ]
});