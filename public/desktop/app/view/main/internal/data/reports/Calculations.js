Ext.define('Financial.view.main.internal.data.reports.Calculations', {
    extend: 'Ext.grid.Panel',

    xtype: 'app-main-internal-data-reports-calculations',

    store: 'Financial.store.data.Report',

    features: [
        {
            ftype: 'groupingsummary',
            groupHeaderTpl: [
                '{name:this.formatName}',
                {
                    formatName: function(type) {
                        switch (type) {
                            case 'spending':
                                return 'Spendings';
                            case 'remaining':
                                return 'Remaining';
                        }
                    }
                }
            ]
        }
    ],

    hideHeaders: true,

    columns: [
        {
            dataIndex: 'description',
            text: 'Description',
            flex: 1,
            summaryRenderer: function () {
                return '<b>TOTAL</b>';
            }
        },
        {
            dataIndex: 'sum',
            text: 'Sum',
            flex: 1,
            renderer: function (value) {
                return Ext.String.format(
                    '{0} {1}',
                    value,
                    Financial.data.currency.default.symbol
                );
            },
            summaryType: 'sum',
            summaryRenderer: function (value) {
                return Ext.String.format(
                    '<b>{0} {1}</b>',
                    value,
                    Financial.data.currency.default.symbol
                );
            }
        }
    ]
});