(function () {
    var addSumToTitle = function (grid, items) {
        var Currency = Financial.data.Currency;

        grid.setTitle(Ext.String.format(
            '<div class="grid-custom-title"><span class="grid-title-name">{0}</span><span class="grid-title-sum">{1}</span></div>',
            grid.config.title,
            Ext.String.format(
                '{0} {1}',
                Financial.util.Format.money(
                    Currency.convertDefaultToDisplay(
                        items.reduce(function (prev, curr) {
                            return prev + curr.sum;
                        }, 0)
                    )
                ),
                Currency.getDisplayCurrency().get('symbol')
            )
        ));
    };

    Ext.define('Financial.controller.Data', {
        extend: 'Ext.app.Controller',

        selectors: {
            toolbar: 'app-main-internal-toolbar',
            includeCombo: 'app-main-internal-data-reports combo',
            expensesGrid: 'app-main-internal-data-expenses',
            incomesGrid: 'app-main-internal-data-incomes'
        },

        getComponent: function (selector) {
            return Financial.app.getMainView().down(selector);
        },

        getIncludeCombo: function () {
            return this.getComponent(this.selectors.includeCombo);
        },

        getExpensesGrid: function () {
            return this.getComponent(this.selectors.expensesGrid);
        },

        getIncomesGrid: function () {
            return this.getComponent(this.selectors.incomesGrid);
        },

        resetCache: function () {
            this.cache = {};
            this.cache.include = this.getIncludeCombo().getValue();
            this.cache.endDate = this.getEndDate();
            this.cache.startDate = this.getStartDate();
            this.cache.today = new Date();
        },

        getStartDate: function () {
            var date = new Date(this.cache.endDate);
            var include = this.cache.include;

            date.setHours(0);
            date.setMinutes(0);
            date.setMilliseconds(0);

            switch (include) {
                case 'ly':
                    date.setYear(date.getFullYear() - 1);
                    break;
                case 'lm':
                    date.setMonth(date.getMonth() - 1);
                    break;
                case 'lw':
                    date.setDate(date.getDate() - 7);
                    break;
                case 'ld':
                    date.setDate(date.getDate() - 1);
                    break;
                default:
                    date = null;
                    break;
            }

            return date;
        },

        getEndDate: function () {
            var controller = Financial.app.getMainView().down(this.selectors.toolbar).getController();

            return new Date(controller.getEndDatePicker().getValue());
        },

        getReportGrid: function (name) {
            return Financial.app.getMainView().down('[itemId="' + name + '"]');
        },

        syncSummary: function () {
            Ext.Logger.info('Sync summary');

            var mainView = Financial.app.getMainView();
            var summary = mainView.down('app-main-internal-data-reports');

            summary.setLoading(true);

            Ext.Ajax.request({
                url: Financial.routes.report.summary,
                method: 'GET',
                params: _.pickBy({
                    end_date: this.cache.include === 'ut' ? Ext.util.Format.date(this.cache.today, 'Y-m-d') : this.getEndDate(),
                    start_date: this.getStartDate()
                },  _.identity),
                success: function (response) {
                    var json = JSON.parse(response.responseText);
                    var expenses = json.expensesData;
                    var incomes = json.incomesData;
                    var remaining = json.remainingData;

                    this.renderExpenses(expenses);
                    this.renderIncomes(incomes);
                    this.renderBalance(remaining);

                    var expensesByCategory = this.getReportGrid('expensesByCategory');

                    expensesByCategory.getStore().loadData(json.expensesByCategory);

                    summary.setLoading(false);
                }.bind(this)
            });
        },

        syncCharts: function () {
            Ext.Logger.info('Sync charts');

            var mainView = Financial.app.getMainView();
            var panels = mainView.query('app-main-internal-charts-baseChartPanel');

            panels.forEach(function (panel) {
                var chart = panel.down('chart');

                if (chart != null) {
                    panel.drawChart();
                }
            });
        },

        syncReports: function () {
            this.resetCache();

            var mainView = Financial.app.getMainView();

            var data = mainView.down('app-main-internal-data');
            var charts = mainView.down('app-main-internal-charts');

            if (data.isVisible()) {
                this.syncSummary();
            } else if (charts.isVisible()) {
                this.syncCharts();
            } else {
                this.syncSummary();
            }
        },

        renderExpenses: function (expenses) {
            var byML = expenses.byML;
            var byUser = expenses.byUser;

            var expensesByMLGrid = this.getReportGrid('expensesByML');

            expensesByMLGrid.getStore().loadData(byML);
            addSumToTitle(expensesByMLGrid, byML);

            var expensesByUserGrid = this.getReportGrid('expensesByUser');

            expensesByUserGrid.getStore().loadData(byUser);
            addSumToTitle(expensesByUserGrid, byUser);
        },

        renderIncomes: function (incomes) {
            var byML = incomes.byML;
            var byUser = incomes.byUser;

            var incomesByMLGrid = this.getReportGrid('incomesByML');

            incomesByMLGrid.getStore().loadData(byML);
            addSumToTitle(incomesByMLGrid, byML);

            var incomesByUserGrid = this.getReportGrid('incomesByUser');

            incomesByUserGrid.getStore().loadData(byUser);
            addSumToTitle(incomesByUserGrid, byUser);
        },

        renderBalance: function (balance) {
            var byML = balance.byML;
            var byUser = balance.byUser;

            var balanceByMLGrid = this.getReportGrid('balanceByML');

            balanceByMLGrid.getStore().loadData(byML);
            addSumToTitle(balanceByMLGrid, byML);

            var balanceByUserGrid = this.getReportGrid('balanceByUser');

            balanceByUserGrid.getStore().loadData(byUser);
            addSumToTitle(balanceByUserGrid, byUser);
        },

        getExpensesStore: function () {
            return Financial.data.Expense.getStore();
        },

        getIncomesStore: function () {
            return Financial.data.Income.getStore();
        },

        syncExpenses: function (params) {
            var expensesStore = this.getExpensesStore();
            var expensesGrid = this.getExpensesGrid();

            expensesGrid.setLoading(true);

            if (params != null) {
                expensesStore.proxy.extraParams = params;
            }
            expensesStore.load(function () {
                expensesGrid.setLoading(false);
            });
        },

        syncIncomes: function (params) {
            var incomesStore = this.getIncomesStore();
            var incomesGrid = this.getIncomesGrid();

            incomesGrid.setLoading(true);

            if (params != null) {
                incomesStore.proxy.extraParams = params;
            }
            incomesStore.load(function () {
                incomesGrid.setLoading(false);
            });
        },

        loadData: function (params) {
            var me = this;

            me.syncReports();
            me.syncExpenses(params);
            me.syncIncomes(params);
        }
    });
}());