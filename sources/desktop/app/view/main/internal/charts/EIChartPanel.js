(function () {
    Ext.define('Financial.view.main.internal.charts.EIChartPanel', {
        extend: 'Financial.view.main.internal.charts.BaseLineChartPanel',

        xtype: 'app-main-internal-charts-eiChartPanel',

        drawChart: function () {
            var me = this;

            me.setLoading(true);

            Ext.Ajax.request({
                url: Financial.routes.report.chart.expensesIncomesByUser,
                method: 'GET',
                params: {
                    display: me.getDisplayComboValue(),
                    end_date: Financial.app.getController('Data').getEndDate()
                },
                success: function (response) {
                    var data = JSON.parse(response.responseText);

                    data.series = data.series.map(function (each) {
                        return Object.assign(me.getLineConfig(), each);
                    });

                    me.createChart(data);
                    me.setLoading(false);
                }
            });
        }
    });
}());