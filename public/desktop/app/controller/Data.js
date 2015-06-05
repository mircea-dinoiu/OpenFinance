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
        incomesGrid: 'app-main-internal-data-incomes-grid'
    },

    getExpenses: function () {
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

        var ret = [];

        Financial.data.user.store.each(function (record) {
             if (users[record.get('id')]) {
                 ret.push({
                     sum: parseFloat(users[record.get('id')].toFixed(2)),
                     description: record.get('full_name'),
                     type: 'expense'
                 });
             }
        });

        return ret;
    },

    getRemaining: function () {
        return [
            {
                sum: 1000,
                type: 'remaining',
                description: 'Selected date range'
            },
            {
                sum: 223,
                type: 'remaining',
                description: 'Past'
            }
        ];
    },

    syncReports: function () {
        if (this.loadingCount === 0) {
            var mainView = Financial.app.getMainView(),
                calculationsGrid = mainView.down('app-main-internal-data-reports-calculations');

            calculationsGrid.getStore().loadData(
                Ext.Array.merge(
                    this.getExpenses(),
                    this.getRemaining()
                )
            );
        }
    },

    loadData: function (extraParams) {
        var me = this,
            mainView = Financial.app.getMainView();

        Ext.each([
            me.selectors.expensesGrid,
            me.selectors.incomesGrid
        ], function (gridSelector) {
            var store = mainView.down(gridSelector).getStore();

            me.setLoading(true);

            store.proxy.extraParams = extraParams;
            store.load(function () {
                me.setLoading(false);
                me.syncReports();
            });
        });
    }
});