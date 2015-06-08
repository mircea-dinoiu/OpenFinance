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

            if (currencyId !== parseInt(Financial.util.Currency.getDefaultCurrency().id)) {
                sum = Financial.util.Currency.convertToDefault(sum, currencyId);
            }

            sum /= recordUsers.length;

            Ext.each(recordUsers, function (userId) {
                if (!users[userId]) {
                    users[userId] = 0;
                }

                users[userId] += sum;
            });
        });

        var expenses = [];

        Financial.data.user.store.each(function (record) {
            if (users[record.get('id')]) {
                expenses.push({
                    sum: parseFloat(users[record.get('id')].toFixed(2)),
                    description: record.get('full_name'),
                    type: 'expense',
                    key: 'expenses_for_user:' + record.get('id')
                });
            }
        });

        return expenses;
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
                description: Financial.util.User.getUserById(id).get('full_name'),
                type: 'income',
                key: 'income:' + id
            });
        });

        return data;
    },

    getRemainingData: function (spent) {
        var data = [],
            incomesGrid = Financial.app.getMainView().down(this.selectors.incomesGrid),
            mainView = Financial.app.getMainView(),
            toolbar = mainView.down('app-main-internal-toolbar');

        data.push({
            sum: (incomesGrid.getStore().sum('sum') - spent).toFixed(2),
            description: toolbar.getController().getDateRangeDisplayValue(),
            type: 'remaining',
            key: 'remaining'
        });

        data.push({
            sum: this.cache.past_remaining,
            description: 'Past',
            type: 'remaining',
            key: 'past_remaining'
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
                sum = record.get('sum');

            if (record.get('currency_id') !== parseInt(Financial.util.Currency.getDefaultCurrency().id)) {
                sum = Financial.util.Currency.convertToDefault(sum, record.get('currency_id'));
            }

            if (rCategories.length > 0) {
                Ext.each(rCategories, function (categoryId) {
                    if (!categories[categoryId]) {
                        categories[categoryId] = 0;
                    }

                    categories[categoryId] += sum;
                });
            } else {
                if (!categories[0]) {
                    categories[0] = 0;
                }

                categories[0] += sum;
            }
        });

        Ext.Object.each(categories, function (key, sum) {
            var desc,
                categoryId = parseInt(key);

            if (categoryId === 0) {
                desc = '<i>Unclassified</i>';
            } else {
                desc = Financial.util.Category.getCategoryById(categoryId).get('name');
            }

            data.push({
                sum: sum,
                description: desc,
                type: 'category',
                key: 'category:' + categoryId,
                localKey: categoryId
            })
        });

        data.sort(function (a, b) {
            if (a.key === 'category:0') {
                return -1;
            }

            if (b.key === 'category:0') {
                return 1;
            }

            return Financial.util.Category.getCategoryById(a.localKey).get('expenses') > Financial.util.Category.getCategoryById(b.localKey).get('expenses') ? -1 : 1;
        });

        return data;
    },

    getCalculationsData: function () {
        var expenses = this.getExpensesData(),
            spent;

        spent = Ext.Array.map(
            expenses,
            function (expense) {
                return expense.sum
            }
        ).reduce(
            function (a, b) {
                return a + b;
            },
            0
        );

        return Ext.Array.merge(
            expenses,
            this.getRemainingData(spent),
            this.getIncomesData()
        );
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