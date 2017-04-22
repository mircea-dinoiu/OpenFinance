(function () {
    Ext.define('Financial.view.main.internal.charts.EIChartPanel', {
        extend: 'Financial.view.main.internal.charts.BaseLineChartPanel',

        xtype: 'app-main-internal-charts-eiChartPanel',

        drawChart: function () {
            var me = this;

            Ext.Ajax.request({
                url: Financial.routes.report.chart.expensesIncomesByUser,
                method: 'GET',
                params: {
                    display: this.getDisplayComboValue(),
                    end_date: Financial.app.getController('Data').getEndDate()
                },
                success: function (response) {
                    var data = JSON.parse(response.responseText);

                    data.series = data.series.map(function (each) {
                        return Object.assign(me.getLineConfig(), each);
                    });

                    this.createChart(data);
                }.bind(this)
            });
        }
    });
}());