(function () {
    Ext.define('Financial.view.main.internal.charts.EBCChartPanel', {
        extend: 'Financial.view.main.internal.charts.BaseLineChartPanel',

        xtype: 'app-main-internal-charts-ebcChartPanel',

        drawChart: function () {
            var me = this;
            var series = [];
            var categoryIds = [];
            var timeMap = {};
            var timeFormat = this.getTimeFormat();

            Financial.data.Expense.getStore().each(function (record) {
                if (!me.recordIsInRange(record)) {
                    return;
                }
                
                var recordCategories = record.get('categories');
                var sum = record.get('sum');
                var addData = function (categoryId, rawCatSum) {
                    if (categoryIds.indexOf(categoryId) === -1) {
                        categoryIds.push(categoryId);
                    }

                    var dataKey = 'data' + categoryId;

                    me.addToTimeMap(timeMap, dataKey, record, rawCatSum / (recordCategories.length || 1), timeFormat);
                };

                if (record.get('currency_id') !== parseInt(Financial.data.Currency.getDefaultCurrency().id)) {
                    sum = Financial.data.Currency.convertToDefault(sum, record.get('currency_id'));
                }

                if (recordCategories.length > 0) {
                    Ext.each(recordCategories, function (rawCategoryId) {
                        var categoryId;

                        if (Financial.data.Category.getById(rawCategoryId)) {
                            categoryId = rawCategoryId;
                        } else {
                            categoryId = 0;
                        }

                        addData(categoryId, sum);
                    });
                } else {
                    addData(0, sum);
                }
            });

            categoryIds.forEach(function (id) {
                series.push(Object.assign({}, me.getLineConfig(), {
                    title: Financial.data.Category.getNameById(id),
                    yField: 'data' + id
                }));
            });

            var categoryIdsAsFields = categoryIds.map(function (id) {
                return 'data' + id;
            });

            this.createChart({
                fields: categoryIdsAsFields,
                map: timeMap,
                series: series
            });
        }
    });
}());