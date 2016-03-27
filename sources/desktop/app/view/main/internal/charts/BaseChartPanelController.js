Ext.define('Financial.view.main.internal.charts.BaseChartPanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.app-main-internal-charts-baseChartPanel',

    onDisplayChange: function () {
        this.getView().drawChart();
    },

    onSeriesTooltipRender: function (tooltip, record, item) {
        var title = item.series.getTitle();

        tooltip.setHtml(Ext.String.format(
            '{0} on {1}: {2} {3}',
            title,
            record.get('time'),
            Financial.util.Format.money(record.get(item.series.getYField())),
            Financial.data.Currency.getDefaultCurrency().get('symbol')
        ));
    },

    onCheckAll: function () {
        var chart = this.getView().down('chart');
        var store = chart.getLegendStore();
        var start = new Date();

        Ext.suspendLayouts();
        store.each(function (record) {
            record.set('disabled', false);
        });
        Ext.resumeLayouts();

        Ext.Logger.info(Ext.String.format('Check all action finished in {0}ms', new Date() - start));
    },

    onUncheckAll: function () {
        var chart = this.getView().down('chart');
        var store = chart.getLegendStore();
        var start = new Date();

        Ext.suspendLayouts();
        store.each(function (record) {
            record.set('disabled', true);
        });
        store.first().set('disabled', false);
        Ext.resumeLayouts();

        Ext.Logger.info(Ext.String.format('Uncheck all action finished in {0}ms', new Date() - start));
    }
});