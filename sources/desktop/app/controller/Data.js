(function () {
    var description = function (text) {
        return Ext.String.format('<span data-qtip="{0}">{0}</span>', text);
    };

    var safeNum = function (num) {
        return Number(num.toFixed(2));
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

        requires: [
            'Financial.ux.window.Notification'
        ],

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

        recordIsInRange: function (record) {
            switch (this.cache.include) {
                case 'ut':
                    if (Ext.util.Format.date(record.get('created_at'), 'Y-m-d') > Ext.util.Format.date(this.cache.today, 'Y-m-d')) {
                        return false;
                    }
                    break;
                default:
                    var startDate = this.cache.startDate;

                    if (startDate != null && record.get('created_at').toISOString() < startDate.toISOString()) {
                        return false;
                    }
            }

            return true;
        },

        formatMLName: function (id) {
            return Financial.data.ML.getNameById(id);
        },

        addMLEntries: function (data, mls) {
            var push = function (id, name, group) {
                data.push({
                    sum: mls[id],
                    description: description(name),
                    reference: id,
                    group: group
                });
            };

            if (mls['0']) {
                push('0', this.formatMLName(0));
            }

            Financial.data.ML.getStore().each(function (record) {
                var id = record.get('id');

                if (mls[id]) {
                    push(id, record.get('name'), record.get('type_id'));
                }
            });
        },

        getUniques: function (expenses, incomes) {
            return Ext.Array.unique(Ext.Array.map(Ext.Array.merge(
                expenses,
                incomes
            ).filter(function (item) {
                return item.isTotal !== true;
            }), function (item) {
                return parseInt(item.reference);
            }));
        },

        getRemainingSum: function (expenses, incomes, id) {
            var filteredExpenses, filteredIncomes;

            filteredExpenses = expenses.filter(function (expense) {
                return expense.reference == id;
            })[0];

            filteredIncomes = incomes.filter(function (income) {
                return income.reference == id;
            })[0];

            filteredExpenses = filteredExpenses ? filteredExpenses.sum : 0;
            filteredIncomes = filteredIncomes ? filteredIncomes.sum : 0;

            return safeNum(filteredIncomes - filteredExpenses);
        },

        getRemainingData: function (expenses, incomes) {
            var me = this,
                data = {byUser: [], byML: []},
                users,
                mls,
                totalRemainingByUser = {},
                totalRemainingByML = {};

            users = this.getUniques(expenses.byUser, incomes.byUser);
            mls = this.getUniques(expenses.byML, incomes.byML);

            /**
             * Remaining present
             */
            Ext.each(mls, function (id) {
                totalRemainingByML[id] = me.getRemainingSum(expenses.byML, incomes.byML, id);
            });

            Ext.each(users, function (id) {
                totalRemainingByUser[id] = me.getRemainingSum(expenses.byUser, incomes.byUser, id);
            });

            /**
             * Total remaining
             */
            Ext.Object.each(totalRemainingByUser, function (id, sum) {
                data.byUser.push({
                    sum: sum,
                    description: description(Financial.data.User.getById(id).get('full_name'))
                });
            });

            Ext.Object.each(totalRemainingByML, function (id, sum) {
                if (sum != 0) {
                    var ml = Financial.data.ML.getById(id);

                    data.byML.push({
                        sum: sum,
                        description: description(me.formatMLName(id)),
                        group: (ml ? ml.get('type_id') : 0) || 0
                    });
                }
            });

            return data;
        },

        getExpensesByCategory: function () {
            var me = this,
                categories = {},
                data = [];

            this.getExpensesStore().each(function (record) {
                if (!me.recordIsInRange(record)) {
                    return;
                }

                var recordCategories = record.get('categories'),
                    sum = record.get('sum'),
                    addData = function (categoryId, rawCatSum) {
                        if (!categories[categoryId]) {
                            categories[categoryId] = {
                                users: {}
                            };
                        }

                        var users = record.get('users');
                        var catSum = rawCatSum / users.length;

                        Ext.each(users, function (id) {
                            if (!categories[categoryId].users[id]) {
                                categories[categoryId].users[id] = 0;
                            }

                            categories[categoryId].users[id] += catSum;
                        });
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

            var categoryIds = Ext.Array.map(Ext.Object.getKeys(categories), function (id) {
                return parseInt(id);
            });

            categoryIds.sort(function (id1, id2) {
                if (id1 == 0) {
                    return -1;
                }

                if (id2 == 0) {
                    return 1;
                }

                var sum1 = Ext.Array.sum(Ext.Object.getValues(categories[id1].users));
                var sum2 = Ext.Array.sum(Ext.Object.getValues(categories[id2].users));

                return sum1 > sum2 ? -1 : 1;
            });

            Ext.each(categoryIds, function (categoryId, index) {
                Ext.Object.each(categories[categoryId].users, function (id, sum) {
                    data.push({
                        sum: sum,
                        description: description(Financial.data.User.getById(id).get('full_name')),
                        group: categoryId,
                        index: index
                    });
                });
            });

            return data;
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
                    url: Financial.routes.report.default,
                    method: 'GET',
                    params: _.pick({
                        end_date: this.cache.include === 'ut' ? Ext.util.Format.date(this.cache.today, 'Y-m-d') : this.getEndDate(),
                        start_date: this.getStartDate()
                    },  _.identity),
                    success: function (response) {
                        var json = JSON.parse(response.responseText);
                        var expenses = json.expensesData;
                        var incomes = json.incomesData;

                        this.renderExpenses(expenses);
                        this.renderIncomes(incomes);
                        this.renderBalance(this.getRemainingData(expenses, incomes));

                        var expensesByCategory = this.getReportGrid('expensesByCategory');

                        expensesByCategory.getStore().loadData(this.getExpensesByCategory());
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
                Financial.util.RepeatedModels.generateClones(expensesStore);
                check();

                var count = 0;
                var startDate = me.getStartDate();

                expensesStore.each(function (record) {
                    if (record.get('status') === 'pending' && record.get('persist')) {
                        if (startDate == null || record.get('created_at').toISOString() >= startDate.toISOString()) {
                            return;
                        }

                        count++;
                    }
                });

                if (count) {
                    var html;

                    if (startDate == null) {
                        html = 'There are <strong>{0}</strong> pending expenses'.format(
                            count
                        );
                    } else {
                        html = 'There are <strong>{0}</strong> pending expenses before {1}'.format(
                            count,
                            Ext.Date.format(startDate, 'j, F Y')
                        );
                    }

                    var notification = Ext.create('Financial.ux.window.Notification', {
                        position: 'tr',
                        useXAxis: true,
                        iconCls: 'x-fa fa-exclamation-triangle',
                        title: 'Notice',
                        html: html,
                        slideInDuration: 800,
                        slideBackDuration: 1500,
                        autoCloseDelay: 5000,
                        slideInAnimation: 'elasticIn',
                        slideBackAnimation: 'elasticIn'
                    });

                    // notification shows in a bad place when show is called directly (seems like the DOM is not ready for it)
                    setTimeout(notification.show.bind(notification), 0);
                }
            });

            var incomesStore = this.getIncomesStore();

            if (params != null) {
                incomesStore.proxy.extraParams = params;
            }
            incomesStore.load(function () {
                Financial.util.RepeatedModels.generateClones(incomesStore);
                check();
            });
        }
    });
}());