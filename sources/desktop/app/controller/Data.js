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

        var data = [];

        Financial.data.User.getStore().each(function (record) {
            if (users[record.get('id')]) {
                data.push({
                    sum: users[record.get('id')],
                    description: record.get('full_name'),
                    type: 'expense_user',
                    localKey: record.get('id')
                });
            }
        });

        this.addMLEntries(data, mls, 'expense');

        data.push(this.getGroupTotal(users, 'expense_user'));
        data.push(this.getGroupTotal(mls, 'expense_ml'));

        return data;
    },

    formatMLName: function (id) {
        if (id == 0) {
            return '<i>Unclassified</i>';
        }

        return Financial.data.MoneyLocation.getById(id).get('name');
    },

    addMLEntries: function (data, mls, prefix) {
        var push = function (id, name) {
            data.push({
                sum: mls[id],
                description: name,
                type: prefix + '_ml',
                localKey: id
            });
        };

        if (mls['0']) {
            push('0', this.formatMLName(0));
        }

        Financial.data.MoneyLocation.getStore().each(function (record) {
            var id = record.get('id');

            if (mls[id]) {
                push(id, record.get('name'));
            }
        });
    },

    getGroupTotal: function (data, type) {
        return {
            sum: Ext.Object.getValues(data).reduce(function (a, b) {
                return a + b;
            }, 0),
            description: 'TOTAL',
            localKey: 'total',
            type: type
        };
    },

    getIncomesData: function () {
        var data = [],
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
            data.push({
                sum: sum,
                description: Financial.data.User.getById(id).get('full_name'),
                type: 'income_user',
                localKey: id
            });
        });

        this.addMLEntries(data, mls, 'income');

        data.push(this.getGroupTotal(users, 'income_user'));
        data.push(this.getGroupTotal(mls, 'income_ml'));

        return data;
    },

    getUniques: function (expenses, incomes, suffix) {
        return Ext.Array.unique(Ext.Array.map(Ext.Array.merge(
            expenses.filter(function (expense) {
                if (!Ext.String.endsWith(expense.type, '_' + suffix)) {
                    return false;
                }

                return expense.localKey !== 'total';
            }),
            incomes.filter(function (income) {
                if (!Ext.String.endsWith(income.type, '_' + suffix)) {
                    return false;
                }

                return income.localKey !== 'total';
            })
        ), function (item) {
            return parseInt(item.localKey);
        }));
    },

    getRemainingSum: function (expenses, incomes, id, suffix) {
        var filteredExpenses, filteredIncomes;

        filteredExpenses = expenses.filter(function (expense) {
            if (!Ext.String.endsWith(expense.type, '_' + suffix)) {
                return false;
            }

            return expense.localKey == id;
        })[0];

        filteredIncomes = incomes.filter(function (income) {
            if (!Ext.String.endsWith(income.type, '_' + suffix)) {
                return false;
            }

            return income.localKey == id;
        })[0];

        filteredExpenses = filteredExpenses ? filteredExpenses.sum : 0;
        filteredIncomes = filteredIncomes ? filteredIncomes.sum : 0;

        return filteredIncomes - filteredExpenses;
    },

    getRemainingData: function (expenses, incomes) {
        var me = this,
            data = [],
            incomesGrid = Financial.app.getMainView().down(this.selectors.incomesGrid),
            mainView = Financial.app.getMainView(),
            toolbar = mainView.down('app-main-internal-toolbar'),
            spent,
            users,
            mls,
            totalRemainingByUser = {},
            totalRemainingByML = {};

        spent = Ext.Array.map(expenses, function (e) {
            return e.localKey !== 'total' ? e.sum / 2 : 0;
        }).reduce(function (a, b) {
            return a + b;
        }, 0);

        users = this.getUniques(expenses, incomes, 'user');
        mls = this.getUniques(expenses, incomes, 'ml');

        /**
         * Remaining present
         */
        var presentTotal = {
            sum: incomesGrid.getStore().sum('sum') - spent,
            description: toolbar.getController().getDateRangeDisplayValue(),
            hasChildren: true,
            localKey: 'present'
        };

        data.push(Object.assign({
            type: 'remaining_user'
        }, presentTotal));

        Ext.each(mls, function (id) {
            totalRemainingByML[id] = me.getRemainingSum(expenses, incomes, id, 'ml');
        });

        Ext.each(users, function (id) {
            totalRemainingByUser[id] = me.getRemainingSum(expenses, incomes, id, 'user');

            data.push({
                sum: totalRemainingByUser[id],
                description: Financial.data.User.getById(id).get('full_name'),
                type: 'remaining_user',
                localKey: id,
                display: true,
                parent: 'present'
            });
        });

        /**
         * Remaining past
         */
        var pastTotal = {
            sum: this.cache.past_remaining.sum,
            description: 'Past',
            localKey: 'past',
            hasChildren: true
        };

        data.push(Object.assign({type: 'remaining_user'}, pastTotal));

        Ext.Object.each(this.cache.past_remaining.money_locations, function (id, sum) {
            totalRemainingByML[id] = (totalRemainingByML[id] || 0) + sum;
        });

        Ext.Object.each(this.cache.past_remaining.users, function (id, sum) {
            totalRemainingByUser[id] = (totalRemainingByUser[id] || 0) + sum;

            data.push({
                sum: sum,
                description: Financial.data.User.getById(id).get('full_name'),
                type: 'remaining_user',
                localKey: id,
                display: true,
                parent: 'past'
            });
        });

        /**
         * Total remaining
         */
        var total = {
            description: 'TOTAL',
            localKey: 'total'
        };

        var totalItem = {
            display: true
        };

        data.push(Object.assign({
            type: 'remaining_user',
            hasChildren: true,
            sum: Ext.Object.getValues(totalRemainingByUser).reduce(function (a, b) {
                return a + b;
            }, 0)
        }, total));

        Ext.Object.each(totalRemainingByUser, function (id, sum) {
            data.push(Object.assign({
                sum: sum,
                description: Financial.data.User.getById(id).get('full_name'),
                type: 'remaining_user',
                localKey: id,
                parent: 'total'
            }, totalItem));
        });

        Ext.Object.each(totalRemainingByML, function (id, sum) {
            if (sum != 0) {
                data.push(Object.assign({
                    sum: sum,
                    description: me.formatMLName(id),
                    type: 'remaining_ml',
                    localKey: id
                }, totalItem));
            }
        });

        data.push(Object.assign({
            type: 'remaining_ml',
            sum: Ext.Object.getValues(totalRemainingByML).reduce(function (a, b) {
                return a + b;
            }, 0)
        }, total));

        return data;
    },

    getCategoriesData: function () {
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
                            sum: 0,
                            users: {}
                        };
                    }

                    categories[categoryId].sum += sum;

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
            var desc,
                category = categories[categoryId];

            if (categoryId === 0) {
                desc = '<i>Unclassified</i>';
            } else {
                desc = Financial.data.Category.getById(categoryId).get('name');
            }

            data.push({
                sum: category.sum,
                description: desc,
                type: 'category',
                localKey: categoryId,
                hasChildren: true
            });

            Ext.Object.each(category.users, function (id, sum) {
                data.push({
                    sum: sum,
                    description: Financial.data.User.getById(id).get('full_name'),
                    type: 'category',
                    localKey: id,
                    display: false,
                    parent: categoryId
                })
            });
        });

        return data;
    },

    getCalculationsData: function () {
        var expenses = this.getExpensesData(),
            expensesGrid = Financial.app.getMainView().down(this.selectors.expensesGrid),
            expensesStore = expensesGrid.getStore();

        if (expensesStore.isFiltered() && expensesStore.getCount() !== expensesStore.getTotalCount()) {
            return expenses;
        } else {
            var incomes = this.getIncomesData();

            return Ext.Array.merge(
                expenses,
                incomes,
                this.getRemainingData(expenses, incomes)
            );
        }
    },

    syncReports: function () {
        if (this.loadingCount === 0) {
            var mainView = Financial.app.getMainView(),
                calculationsGrid = mainView.down('app-main-internal-data-reports-calculations'),
                categoriesGrid = mainView.down('app-main-internal-data-reports-categories');

            calculationsGrid.getStore().loadData(this.getCalculationsData());
            categoriesGrid.getStore().loadData(this.getCategoriesData());
        }
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