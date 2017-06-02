Ext.define('Financial.view.main.internal.data.reports.ReportGrid', {
    extend: 'Ext.grid.Panel',
    hideHeaders: true,
    collapsible: true,
    animCollapse: false,
    xtype: 'app-main-internal-data-reports-report-grid',

    viewConfig: {
        stripeRows: false
    },

    initComponent: function () {
        this.store = Ext.create('Financial.store.data.ReportStore');

        this.callParent(arguments);
        this.store.on('refresh', this.gsAutoCollapse, this);

        if (this.color) {
            this.addCls(this.color);
        }
    },

    gsAutoCollapse: function () {
        var gsFeature = null;
        var gsConfig = null;

        Ext.each(this.getView().features, function (feature) {
            if (feature.ftype === 'groupingsummary') {
                gsFeature = feature;
                return false;
            }
        });

        Ext.each(this.features, function (feature) {
            if (feature.ftype === 'groupingsummary') {
                gsConfig = feature;
                return false;
            }
        });

        // TODO: try catch is bad here. trying to fix an ExtJS issue here
        try {
            if (gsFeature != null && gsConfig != null) {
                if (gsConfig.startCollapsed) {
                    gsFeature.collapseAll();
                } else {
                    gsFeature.expandAll();
                }
            }
        } catch (e) {
            Ext.Logger.warn(e);
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
            renderer: function (value, metaData, record) {
                var Currency = Financial.data.Currency;
                var displayCurrency = Currency.getDisplayCurrency();

                Financial.util.Misc.anotherCurrenciesTooltip(
                    metaData,
                    displayCurrency,
                    record
                );

                return Ext.String.format(
                    '{0} {1}',
                    Financial.util.Format.money(
                        Currency.convertDefaultToDisplay(
                            value
                        )
                    ),
                    displayCurrency.get('symbol')
                );
            }
        }
    ]
});