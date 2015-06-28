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
            expensesGrid = Financial.app.getMainView().down(this.selectors.expensesGrid);

        expensesGrid.getStore().each(function (record) {
            var sum = record.get('sum'),
                recordUsers = record.get('users'),
                currencyId = record.get('currency_id');

            if (currencyId !== parseInt(Financial.data.Currency.getDefaultCurrency().id)) {
                sum = Financial.data.Currency.convertToDefault(sum, currencyId);
            }

            sum /= recordUsers.length;

            Ext.each(recordUsers, function (userId) {
                if (!users[userId]) {
                    users[userId] = 0;
                }

                users[userId] += sum;
            });
        });

        var data = [];

        Financial.data.User.getStore().each(function (record) {
            if (users[record.get('id')]) {
                data.push({
                    sum: users[record.get('id')],
                    description: record.get('full_name'),
                    type: 'expense',
                    localKey: record.get('id')
                });
            }
        });

        data.push({
            sum: Ext.Array.map(data, function (each) {
                return each.sum;
            }).reduce(function (a, b) {
                return a + b;
            }, 0),
            description: 'TOTAL',
            type: 'expense',
            localKey: 'total'
        });

        return data;
    },

    getIncomesData: function () {
        var data = [],
            mainView = Financial.app.getMainView(),
            incomesGrid = mainView.down(this.selectors.incomesGrid),
            toolbar = mainView.down('app-main-internal-toolbar'),
            users = {};

        incomesGrid.getStore().each(function (record) {
            var userId = record.get('user_id');

            if (!users[userId]) {
                users[userId] = 0;
            }

            users[userId] += record.get('sum');
        });

        Ext.Object.each(users, function (id, sum) {
            data.push({
                sum: sum,
                description: Financial.data.User.getById(id).get('full_name'),
                type: 'income',
                localKey: id
            });
        });

        data.push({
            sum: Ext.Array.map(data, function (each) {
                return each.sum;
            }).reduce(function (a, b) {
                return a + b;
            }, 0),
            description: 'TOTAL',
            type: 'income',
            localKey: 'total'
        });

        return data;
    },

    getRemainingData: function (expenses, incomes) {
        var data = [],
            incomesGrid = Financial.app.getMainView().down(this.selectors.incomesGrid),
            mainView = Financial.app.getMainView(),
            toolbar = mainView.down('app-main-internal-toolbar'),
            spent,
            users,
            totalRemainingByUser = {};

        spent = Ext.Array.map(expenses, function (e) {
            return e.localKey !== 'total' ? e.sum : 0;
        }).reduce(function (a, b) {
            return a + b;
        }, 0);

        users = Ext.Array.unique(Ext.Array.map(Ext.Array.merge(
            expenses.filter(function (expense) {
                return expense.localKey !== 'total';
            }),
            incomes.filter(function (income) {
                return income.localKey !== 'total';
            })
        ), function (user) {
            return parseInt(user.localKey);
        }));

        /**
         * Remaining present
         */
        data.push({
            sum: incomesGrid.getStore().sum('sum') - spent,
            description: toolbar.getController().getDateRangeDisplayValue(),
            type: 'remaining',
            localKey: 'present',
            hasChildren: true
        });

        Ext.each(users, function (id) {
            var expensesForUser, incomesForUser;

            expensesForUser = expenses.filter(function (expense) {
                return expense.localKey == id;
            })[0];

            incomesForUser = incomes.filter(function (income) {
                return income.localKey == id;
            })[0];

            expensesForUser = expensesForUser ? expensesForUser.sum : 0;
            incomesForUser = incomesForUser ? incomesForUser.sum : 0;

            totalRemainingByUser[id] = incomesForUser - expensesForUser;

            data.push({
                sum: totalRemainingByUser[id],
                description: Financial.data.User.getById(id).get('full_name'),
                type: 'remaining',
                localKey: id,
                display: false,
                parent: 'present'
            });
        });

        /**
         * Remaining past
         */
        data.push({
            sum: this.cache.past_remaining.sum,
            description: 'Past',
            type: 'remaining',
            localKey: 'past',
            hasChildren: true
        });

        Ext.Object.each(this.cache.past_remaining.users, function (id, sum) {
            if (!totalRemainingByUser[id]) {
                totalRemainingByUser[id] = 0;
            }

            totalRemainingByUser[id] += sum;

            data.push({
                sum: sum,
                description: Financial.data.User.getById(id).get('full_name'),
                type: 'remaining',
                localKey: id,
                display: false,
                parent: 'past'
            });
        });

        /**
         * Total remaining
         */
        data.push({
            sum: Ext.Array.map(data, function (each) {
                return !each.parent ? each.sum : 0;
            }).reduce(function (a, b) {
                return a + b;
            }, 0),
            description: 'TOTAL',
            type: 'remaining',
            localKey: 'total',
            hasChildren: true
        });

        Ext.Object.each(totalRemainingByUser, function (id, sum) {
            data.push({
                sum: sum,
                description: Financial.data.User.getById(id).get('full_name'),
                type: 'remaining',
                localKey: id,
                display: false,
                parent: 'total'
            });
        });

        return data;
    },

    getCategoriesData: function () {
        var mainView = Financial.app.getMainView(),
            expensesGrid = mainView.down(this.selectors.expensesGrid),
            categories = {},
            data = [];

        expensesGrid.getStore().each(function (record) {
            var rCategories = record.get('categories'),
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

            if (rCategories.length > 0) {
                Ext.each(rCategories, function (categoryId) {
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

        if (expensesStore.getCount() !== expensesStore.getTotalCount()) {
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