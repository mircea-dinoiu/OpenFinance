(function () {
    Ext.define('Financial.view.main.internal.charts.EIChartPanel', {
        extend: 'Financial.view.main.internal.charts.BaseLineChartPanel',

        xtype: 'app-main-internal-charts-eiChartPanel',

        drawChart: function () {
            var me = this;
            var series = [];
            var fields = [];
            var timeMap = {};
            var timeFormat = this.getTimeFormat();

            var addToTimeMap = function (dataKey, record, sum) {
                if (fields.indexOf(dataKey) === -1) {
                    fields.push(dataKey);
                }

                me.addToTimeMap(timeMap, dataKey, record, sum, timeFormat);
            };

            Financial.data.Income.getStore().each(function (record) {
                if (!me.recordIsInRange(record)) {
                    return;
                }
                
                var dataKey = 'data' + record.get('user_id') + 'i';

                addToTimeMap(dataKey, record, record.get('sum'));
            });

            Financial.data.Expense.getStore().each(function (record) {
                if (!me.recordIsInRange(record)) {
                    return;
                }
                
                var users = record.get('users');
                var currencyId = record.get('currency_id');
                var sum = record.get('sum');

                if (currencyId !== parseInt(Financial.data.Currency.getDefaultCurrency().id)) {
                    sum = Financial.data.Currency.convertToDefault(sum, currencyId);
                }

                sum /= users.length;

                users.forEach(function (id) {
                    var dataKey = 'data' + id + 'e';

                    addToTimeMap(dataKey, record, sum);
                });
            });

            fields.forEach(function (field) {
                var cleanField = field.replace(/data/, '');
                var id = cleanField.replace(/[ei]/g, '');
                var type = field.endsWith('e') ? 'Expenses' : 'Incomes';

                series.push(Object.assign({}, me.getLineConfig(), {
                    title: Ext.String.format(
                        '{0}\'s {1}',
                        Financial.data.User.getById(id).get('first_name'),
                        type
                    ),
                    yField: field
                }));
            });

            this.createChart({
                fields: fields,
                map: timeMap,
                series: series
            });
        }
    });
}());