(function () {
    var description = function (description) {
        return Ext.String.format('<span data-qtip="{0}">{0}</span>', description);
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

        selectors: {
            expensesGrid: 'app-main-internal-data-expenses-grid',
            incomesGrid: 'app-main-internal-data-incomes-grid',
            toolbar: 'app-main-internal-toolbar'
        },

        cache: {},

        getStartDate: function () {
            var controller = Financial.app.getMainView().down(this.selectors.toolbar).getController();

            return controller.getStartDateButton().isDisabled() ? null : controller.getStartDatePicker().getValue();
        },

        getEndDate: function () {
            var controller = Financial.app.getMainView().down(this.selectors.toolbar).getController();

            return controller.getEndDateButton().isDisabled() ? null : controller.getEndDatePicker().getValue();
        },

        getExpensesData: function () {
            var users = {},
                mls = {},
                expensesGrid = Financial.app.getMainView().down(this.selectors.expensesGrid);

            expensesGrid.getStore().each(function (record) {
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
                mainView = Financial.app.getMainView(),
                incomesGrid = mainView.down(this.selectors.incomesGrid),
                toolbar = mainView.down('app-main-internal-toolbar'),
                users = {},
                mls = {};

            incomesGrid.getStore().each(function (record) {
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
                mainView = Financial.app.getMainView(),
                toolbar = mainView.down('app-main-internal-toolbar'),
                users,
                mls,
                totalRemainingByUser = {},
                totalRemainingByML = {};

            var groups = {
                TOTAL: 'Total',
                PRESENT: toolbar.getController().getDateRangeDisplayValue(),
                PAST: 'Past'
            };

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

                data.byUser.push({
                    sum: totalRemainingByUser[id],
                    description: description(Financial.data.User.getById(id).get('full_name')),
                    group: groups.PRESENT
                });
            });

            /**
             * Remaining past
             */
            Ext.Object.each(this.cache.past_remaining.money_locations, function (id, sum) {
                totalRemainingByML[id] = (totalRemainingByML[id] || 0) + safeNum(sum);
            });

            Ext.Object.each(this.cache.past_remaining.users, function (id, sum) {
                totalRemainingByUser[id] = (totalRemainingByUser[id] || 0) + safeNum(sum);

                data.byUser.push({
                    sum: safeNum(sum),
                    description: description(Financial.data.User.getById(id).get('full_name')),
                    group: groups.PAST
                });
            });

            /**
             * Total remaining
             */
            Ext.Object.each(totalRemainingByUser, function (id, sum) {
                data.byUser.push({
                    sum: sum,
                    description: description(Financial.data.User.getById(id).get('full_name')),
                    group: groups.TOTAL
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
            var mainView = Financial.app.getMainView(),
                expensesGrid = mainView.down(this.selectors.expensesGrid),
                categories = {},
                data = [];

            expensesGrid.getStore().each(function (record) {
                var recordCategories = record.get('categories'),
                    sum = record.get('sum'),
                    addData = function (categoryId, sum) {
                        if (!categories[categoryId]) {
                            categories[categoryId] = {
                                users: {}
                            };
                        }

                        var users = record.get('users');

                        sum /= users.length;

                        Ext.each(users, function (id) {
                            if (!categories[categoryId]['users'][id]) {
                                categories[categoryId]['users'][id] = 0;
                            }

                            categories[categoryId]['users'][id] += sum;
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
                    })
                });
            });

            return data;
        },

        getReportGrid: function (name) {
            return Financial.app.getMainView().down('[itemId="' + name + '"]');
        },

        syncReports: function () {
            if (this.loadingCount === 0) {
                var expenses = this.getExpensesData(),
                    expensesGrid = Financial.app.getMainView().down(this.selectors.expensesGrid),
                    expensesStore = expensesGrid.getStore();

                this.renderExpenses(expenses);

                if (!(expensesStore.isFiltered() && expensesStore.getCount() !== expensesStore.getTotalCount())) {
                    var incomes = this.getIncomesData();

                    this.renderIncomes(incomes);
                    this.renderBalance(this.getRemainingData(expenses, incomes));
                }

                this.getReportGrid('expensesByCategory').getStore().loadData(this.getExpensesByCategory());
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

            this.getReportGrid('balanceByUser').getStore().loadData(byUser);
        },

        loadData: function (params) {
            var me = this,
                mainView = Financial.app.getMainView();

            Ext.each([
                me.selectors.expensesGrid,
                me.selectors.incomesGrid
            ], function (gridSelector) {
                var store = mainView.down(gridSelector).getStore();

                me.setLoading(true);

                store.proxy.extraParams = params;
                store.load(function () {
                    me.setLoading(false);
                    me.syncReports();
                });
            });

            me.setLoading(true);

            Ext.Ajax.request({
                url: Financial.routes.getReports,
                params: params,
                method: 'GET',
                success: function (response) {
                    me.cache = Ext.JSON.decode(response.responseText);
                    me.setLoading(false);
                    me.syncReports();
                },
                error: function () {
                    Ext.Msg.show({
                        message: 'There was an error while trying to fetch data.<br>Please come back later.',
                        title: 'Error',
                        closable: false,
                        draggable: false
                    });
                }
            });
        }
    });
}());