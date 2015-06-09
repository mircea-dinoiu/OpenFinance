Ext.define('Financial.view.main.internal.data.reports.Calculations', {
    extend: 'Ext.grid.Panel',
    xtype: 'app-main-internal-data-reports-calculations',
    hideHeaders: true,

    initComponent: function () {
        this.store = Ext.create('Financial.store.data.Report');
        this.callParent(arguments);
    },

    features: [
        {
            ftype: 'groupingsummary',
            groupHeaderTpl: [
                '{name:this.formatName}',
                {
                    formatName: function (type) {
                        switch (type) {
                            case 'expense':
                                return 'Expenses';
                            case 'remaining':
                                return 'Remaining';
                            case 'income':
                                return 'Incomes';
                        }
                    }
                }
            ]
        }
    ],

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
                    Financial.util.Format.money(value),
                    Financial.data.currency.default.symbol
                );
            },
            summaryType: 'sum',
            summaryRenderer: function (value) {
                return Ext.String.format(
                    '<b>{0} {1}</b>',
                    Financial.util.Format.money(value),
                    Financial.data.currency.default.symbol
                );
            }
        }
    ]
});