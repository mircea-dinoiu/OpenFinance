Ext.define('Financial.view.main.internal.data.expenses.ExpensesGridController', {
    extend: 'Financial.base.GridViewController',

    alias: 'controller.app-main-internal-data-expenses-grid',

    onStoreRefresh: function () {
        var me = this,
            grid = me.getView(),
            store = grid.getStore(),
            items = [];

        /**
         * Toggle buttons depending on selected records
         */
        Ext.each(['delete', 'deselect'], function (itemId) {
            grid.down(Ext.String.format('button[itemId="{0}"]', itemId)).setDisabled(
                grid.getSelection().length === 0
            );
        });

        /**
         * Create bottom bar text
         */
        items.push(Ext.String.format(
            'Count: {0}',
            store.getCount()
        ));

        items.push(Ext.String.format(
            'Selected count: {0}',
            grid.getSelection().length
        ));

        items.push(Ext.String.format(
            'Selected sum: {0}',
            (function () {
                var sum = 0;

                Ext.each(grid.getSelection(), function (record) {
                    sum += Financial.data.Currency.convertToDefault(record.get('sum'), record.get('currency_id'));
                });

                return Ext.String.format(
                    '{0} {1}',
                    Financial.util.Format.money(sum),
                    Financial.data.Currency.getDefaultCurrency().get('symbol')
                );
            }())
        ));

        grid.down('[itemId="statistics"]').setText(items.join(', '));
    },

    markExpenseAs: function (as, event) {
        var record = event.record,
            store = record.store;

        record.set('status', as);
        store.sync();
    },

    onRowEditing: function (rowEditing, context) {
        var record = context.record;

        if (record.get('users').length === 0) {
            record.set(
                'users',
                Financial.data.User.getAllIds()
            );
        }

        this.callParent(arguments);

        this.onStoreRefresh();
    },

    onDeleteSelectedExpensesClick: function () {
        var me = this,
            grid = me.getView(),
            store = grid.getStore();

        Ext.Msg.show({
            title: 'Delete Expense?',
            message: 'Are you sure you want to delete these expenses?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    store.remove(grid.getSelection());
                    store.sync();
                }
            }
        });
    },

    onDeselectAllClick: function () {
        this.deselectAll();
    },

    deselectAll: function () {
        var grid = this.getView();

        grid.getSelectionModel().deselectAll();
    },

    onSelectionChange: function (grid, selected, eOpts) {
        this.onStoreRefresh();
    },

    onMarkExpenseAsPendingClick: function (a, b, c, e, event) {
        this.markExpenseAs('pending', event);
    },

    onMarkExpenseAsFinishedClick: function (a, b, c, e, event) {
        this.markExpenseAs('finished', event);
    },

    addRecord: function (button) {
        this.newRecordData = {
            currency_id: Financial.data.Currency.getDefaultCurrency().get('id'),
            created_at: Financial.util.Misc.generateEICreationDate(button.up('grid')),
            users: [Financial.data.user.current.id],
            status: 'pending'
        };
        this.newRecordEditAt = 1;

        this.callParent(arguments);
    },

    onBeforeRowEditing: function (rowEditing, context) {
        var editor = rowEditing.getEditor();

        this.callParent(arguments);

        editor.down('datefield').setMinValue(Financial.app.getController('Data').getStartDate());
        editor.down('datefield').setMaxValue(Financial.app.getController('Data').getEndDate());
    }
});