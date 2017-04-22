(function () {
    var description = function (text) {
        return Ext.String.format('<span data-qtip="{0}">{0}</span>', text);
    };

    var addSumToTitle = function (grid, items) {
        grid.setTitle(Ext.String.format(
            '<div class="grid-custom-title"><span class="grid-title-name">{0}</span><span class="grid-title-sum">{1}</span></div>',
            grid.config.title,
            Ext.String.format(
                '{0} {1}',
                Financial.util.Format.money(items.reduce(function (prev, curr) {
                    return prev + curr.sum;
                }, 0)),
                Financial.data.Currency.getDefaultCurrency().get('symbol')
            )
        ));
    };

    Ext.define('Financial.controller.Data', {
        extend: 'Ext.app.Controller',

        loadingCount: 0,

        setLoading: function (toggle) {
            var mainView = Financial.app.getMainView();

            if (toggle) {
                this.loadingCount += 1;
                mainView.setLoading(true);
            } else {
                this.loadingCount -= 1;

                if (this.loadingCount === 0) {
                    mainView.setLoading(false);
                } else {
                    mainView.setLoading(true);
                }
            }
        },

        selectors: {
            toolbar: 'app-main-internal-toolbar',
            includeCombo: 'app-main-internal-data-reports combo'
        },

        getIncludeCombo: function () {
            return Financial.app.getMainView().down(this.selectors.includeCombo);
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

        syncReports: function () {
            this.resetCache();

            Ext.Logger.info('Sync reports');

            var mainView = Financial.app.getMainView();

            var data = mainView.down('app-main-internal-data');
            var charts = mainView.down('app-main-internal-charts');

            if (data.isVisible()) {
                Ext.Ajax.request({
                    url: Financial.routes.report.summary,
                    method: 'GET',
                    params: _.pick({
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
                    }.bind(this)
                });
            } else if (charts.isVisible()) {
                var panels = mainView.query('app-main-internal-charts-baseChartPanel');

                panels.forEach(function (panel) {
                    var chart = panel.down('chart');

                    if (chart != null) {
                        panel.drawChart();
                    }
                });
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

        loadData: function (params) {
            var me = this;
            var includeCombo = me.getIncludeCombo();
            var check = function () {
                me.setLoading(false);

                if (me.loadingCount === 0) {
                    me.syncReports();
                    includeCombo.setDisabled(false);
                }
            };

            includeCombo.setDisabled(true);
            me.setLoading(true);
            me.setLoading(true);

            var expensesStore = this.getExpensesStore();

            if (params != null) {
                expensesStore.proxy.extraParams = params;
            }
            expensesStore.load(function () {
                check();
            });

            var incomesStore = this.getIncomesStore();

            if (params != null) {
                incomesStore.proxy.extraParams = params;
            }
            incomesStore.load(function () {
                check();
            });
        }
    });
}());