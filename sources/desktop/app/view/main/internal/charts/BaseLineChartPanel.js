Ext.define('Financial.view.main.internal.charts.BaseLineChartPanel', {
    extend: 'Financial.view.main.internal.charts.BaseChartPanel',

    xtype: 'app-main-internal-charts-baseLineChartPanel',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Category',
        'Ext.chart.interactions.ItemHighlight',
        'Ext.chart.series.Line'
    ],

    createChart: function (data) {
        var store = data.store || new Ext.data.JsonStore({
                fields: ['time'].concat(data.fields.map(function (field) {
                    return {
                        name: field,
                        type: 'float',
                        defaultValue: 0
                    };
                })),
                data: Ext.Object.getValues(data.map).sort(function (a, b) {
                    if (a.sortField < b.sortField) {
                        return -1;
                    }

                    if (a.sortField > b.sortField) {
                        return 1;
                    }

                    return 0;
                })
            });

        this.replaceChart(Ext.create('Ext.chart.CartesianChart', {
            width: '100%',
            height: '100%',
            animate: true,
            store: store,
            shadow: true,
            legend: {
                docked: 'right'
            },
            axes: [{
                type: 'numeric',
                minimum: 0,
                position: 'left',
                grid: true,
                fields: data.fields
            }, {
                type: 'category',
                position: 'bottom',
                fields: ['time'],
                grid: true,
                label: {
                    rotate: {
                        degrees: -45
                    }
                }
            }],
            series: data.series.sort(function (a, b) {
                if (a.title < b.title) {
                    return -1;
                }

                if (a.title > b.title) {
                    return 1;
                }

                return 0;
            })
        }));
    },

    getLineConfig: function () {
        return {
            type: 'line',
            xField: 'time',
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesTooltipRender'
            }
        };
    }
});