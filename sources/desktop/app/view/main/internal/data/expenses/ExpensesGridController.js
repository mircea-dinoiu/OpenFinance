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
        Ext.each(['delete', 'deselect', 'duplicate'], function (itemId) {
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
            store = grid.getStore(),
            selection = grid.getSelection();

        Ext.Msg.show({
            title: Ext.String.format('Delete {0}?', selection.length > 1 ? 'Expenses' : 'Expense'),
            message: Ext.String.format('Are you sure you want to delete {0}?', selection.length > 1 ? 'these expenses' : 'this expense'),
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

    onDuplicateClick: function () {
        var grid = this.getView();
        var store = grid.getStore();

        Ext.each(grid.getSelection(), function (record) {
            store.add(record.copy(null));
        });

        store.sync();
    },

    onSelectionChange: function () {
        this.onStoreRefresh();
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

    onBeforeRowEditing: function (rowEditing) {
        var editor = rowEditing.getEditor();

        this.callParent(arguments);

        editor.down('datefield').setMaxValue(Financial.app.getController('Data').getEndDate());

        var items = {};

        Financial.data.Expense.getStore().each(function (record) {
            var rawName = record.get('item').toLowerCase().trim();

            if (items[rawName] == null) {
                items[rawName] = {item: record.get('item')};
            }
        });
        editor.down('combo[itemId="item"]').setStore(new Ext.data.JsonStore({
            fields: ['item'],
            data: Ext.Object.getValues(items)
        }));
    },

    onItemInputBlur: function (input) {
        var rowEditor = input.up('roweditor');
        var categoriesCombo = rowEditor.down('combo[itemId="categories"]');
        var categories = categoriesCombo.getValue();

        if (categories.length === 0) {
            var value = input.getValue().toLowerCase().trim();

            Financial.data.Expense.getStore().each(function (record) {
                var rawName = record.get('item').toLowerCase().trim();

                if (rawName == value) {
                    var recordCategories = record.get('categories');

                    if (recordCategories.length) {
                        categoriesCombo.setValue(recordCategories);
                        return false;
                    }
                }
            });
        }
    },

    /**
     * ROUND OPERATIONS
     */

    applyMathMethodOnSelectedExpenses: function (method) {
        var grid = this.getView();
        var records = grid.getSelection();

        Ext.each(records, function (record) {
            record.set('sum', Math[method](record.get('sum')));
        });

        grid.getStore().sync();
    },

    onRoundExpenseSumClick: function () {
        this.applyMathMethodOnSelectedExpenses('round');
    },

    onFloorExpenseSumClick: function () {
        this.applyMathMethodOnSelectedExpenses('floor');
    },

    onCeilExpenseSumClick: function () {
        this.applyMathMethodOnSelectedExpenses('ceil');
    },

    /**
     * STATUS CHANGING OPERATIONS
     */

    setStatusToSelectedExpenses: function (status) {
        var grid = this.getView();
        var records = grid.getSelection();

        Ext.each(records, function (record) {
            record.set('status', status);
        });

        grid.getStore().sync();
    },

    onMarkExpensesSelectionAsPendingClick: function () {
        this.setStatusToSelectedExpenses('pending');
    },

    onMarkExpensesSelectionAsFinishedClick: function () {
        this.setStatusToSelectedExpenses('finished');
    }
});