Ext.define('Financial.view.main.internal.data.reports.Categories', {
    extend: 'Ext.grid.Panel',
    xtype: 'app-main-internal-data-reports-categories',
    hideHeaders: true,

    initComponent: function () {
        this.store = Ext.create('Financial.store.data.Report');
        this.callParent(arguments);
    },

    features: [
        {
            ftype: 'groupingsummary',
            showSummaryRow: false,
            groupHeaderTpl: 'Categories'
        }
    ],

    columns: [
        {
            dataIndex: 'description',
            text: 'Name',
            flex: 1
        },
        {
            dataIndex: 'sum',
            text: 'Sum',
            flex: 1,
            renderer: function (value) {
                return Ext.String.format(
                    '{0} {1}',
                    value.toFixed(2),
                    Financial.data.currency.default.symbol
                );
            }
        }
    ]
});