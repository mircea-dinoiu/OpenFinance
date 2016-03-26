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

        getStartDate: function () {
            var date = new Date(this.getEndDate());
            var include = this.getIncludeCombo().getValue();

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

        getExpensesData: function () {
            var users = {},
                mls = {},
                startDate = this.getStartDate();

            this.getExpensesStore().each(function (record) {
                if (startDate != null && record.get('created_at').toISOString() < startDate.toISOString()) {
                    return;
                }

                var sum = record.get('sum'),
                    recordUsers = record.get('users'),
                    currencyId = record.get('currency_id'),
                    mlId = record.get('money_location_id');

                if (currencyId !== parseInt(Financial.data.Currency.getDefaultCurrency().id)) {
                    sum = Financial.data.Currency.convertToDefault(sum, currencyId);
                }

                mls[mlId] = (mls[mlId] || 0) + sum;

                sum /= recordUsers.length;

                Ext.each(recordUsers, function (userId) {
                    users[userId] = (users[userId] || 0) + sum;
                });
            });

            var data = {
                byUser: [],
                byML: []
            };

            Financial.data.User.getStore().each(function (record) {
                var id = record.get('id');

                if (users[id]) {
                    data.byUser.push({
                        sum: users[id],
                        description: description(record.get('full_name')),
                        reference: id
                    });
                }
            });

            this.addMLEntries(data.byML, mls);

            return data;
        },

        formatMLName: function (id) {
            if (id == 0) {
                return '<i>Unclassified</i>';
            }

            return Financial.data.ML.getById(id).get('name');
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

        getIncomesData: function () {
            var data = {byUser: [], byML: []},
                startDate = this.getStartDate(),
                users = {},
                mls = {};

            this.getIncomesStore().each(function (record) {
                if (startDate != null && record.get('created_at').toISOString() < startDate.toISOString()) {
                    return;
                }

                var uId = record.get('user_id');
                var mlId = record.get('money_location_id');
                var sum = record.get('sum');

                users[uId] = (users[uId] || 0) + sum;
                mls[mlId] = (mls[mlId] || 0) + sum;
            });

            Ext.Object.each(users, function (id, sum) {
                data.byUser.push({
                    sum: sum,
                    description: description(Financial.data.User.getById(id).get('full_name')),
                    reference: id
                });
            });

            this.addMLEntries(data.byML, mls);

            return data;
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
            var categories = {},
                data = [],
                startDate = this.getStartDate();

            this.getExpensesStore().each(function (record) {
                if (startDate != null && record.get('created_at').toISOString() < startDate.toISOString()) {
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

            categoryIds.sort(function (a, b) {
                if (a == 0) {
                    return -1;
                }

                if (b == 0) {
                    return 1;
                }

                return Financial.data.Category.getById(a).get('expenses') > Financial.data.Category.getById(b).get('expenses') ? -1 : 1;
            });

            Ext.each(categoryIds, function (categoryId) {
                Ext.Object.each(categories[categoryId].users, function (id, sum) {
                    data.push({
                        sum: sum,
                        description: description(Financial.data.User.getById(id).get('full_name')),
                        group: categoryId
                    });
                });
            });

            return data;
        },

        getReportGrid: function (name) {
            return Financial.app.getMainView().down('[itemId="' + name + '"]');
        },

        syncReports: function () {
            //<debug>
            console.info('Sync reports');
            //</debug>

            var expenses = this.getExpensesData(),
                expensesStore = this.getExpensesStore();

            this.renderExpenses(expenses);

            if (!(expensesStore.isFiltered() && expensesStore.getCount() !== expensesStore.getTotalCount())) {
                var incomes = this.getIncomesData();

                this.renderIncomes(incomes);
                this.renderBalance(this.getRemainingData(expenses, incomes));
            }

            var expensesByCategory = this.getReportGrid('expensesByCategory');
            
            expensesByCategory.getStore().loadData(this.getExpensesByCategory());
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
            
            expensesStore.proxy.extraParams = params;
            expensesStore.load(function () {
                check();

                var count = 0;
                var startDate = me.getStartDate();

                expensesStore.each(function (record) {
                    if (startDate == null || record.get('created_at').toISOString() >= startDate.toISOString()) {
                        return;
                    }

                    if (record.get('status') === 'pending') {
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
            
            incomesStore.proxy.extraParams = params;
            incomesStore.load(check);
        }
    });
}());