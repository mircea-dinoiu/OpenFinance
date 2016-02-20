Ext.define('Financial.view.main.internal.data.reports.Calculations', {
    extend: 'Financial.view.main.internal.data.reports.AbstractGrid',
    xtype: 'app-main-internal-data-reports-calculations',

    features: [
        {
            ftype: 'groupingsummary',
            showSummaryRow: false,
            groupHeaderTpl: [
                '{name:this.formatName}',
                {
                    formatName: function (type) {
                        var ret = '';

                        if (Ext.String.startsWith(type, 'expense')) {
                            ret = 'Expenses';
                        } else if (Ext.String.startsWith(type, 'remaining')) {
                            ret = 'Balance';
                        } else if (Ext.String.startsWith(type, 'income')) {
                            ret = 'Incomes';
                        }

                        if (Ext.String.endsWith(type, '_ml')) {
                            ret += ' by money location';
                        } else if (Ext.String.endsWith(type, '_user')) {
                            ret += ' by user';
                        }

                        return ret;
                    }
                }
            ]
        }
    ],

    columns: [
        {
            dataIndex: 'description',
            text: 'Description',
            flex: 1
        },
        {
            dataIndex: 'sum',
            text: 'Sum',
            flex: 1,
            align: 'right',
            renderer: function(value, metaData, record) {
                var currency = Financial.data.Currency.getDefaultCurrency();

                Financial.util.Misc.anotherCurrenciesTooltip(
                    metaData,
                    currency,
                    record
                );

                return Ext.String.format(
                    '{0} {1}',
                    Financial.util.Format.money(value),
                    Financial.data.Currency.getDefaultCurrency().get('symbol')
                );
            }
        }
    ]
});