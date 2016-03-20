Ext.define('Financial.view.main.internal.data.reports.ReportGrid', {
    extend: 'Ext.grid.Panel',
    hideHeaders: true,
    collapsible: true,
    xtype: 'app-main-internal-data-reports-report-grid',

    initComponent: function () {
        this.store = Ext.create('Financial.store.data.ReportStore');

        this.callParent(arguments);

        if (this.color) {
            this.addCls(this.color);
        }
    },

    cls: 'report-grid',
    
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