Ext.define('Financial.view.main.internal.data.reports.Categories', {
    xtype: 'app-main-internal-data-reports-categories',

    extend: 'Financial.view.main.internal.data.reports.AbstractGrid',

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