Ext.define('Financial.view.main.internal.data.expenses.ExpensesGridController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.app-main-internal-data-expenses-grid',

    newRecord: undefined,

    removeNewRecordFromStore: function () {
        if (this.newRecord) {
            var record = this.newRecord,
                store = record.store;

            delete this.newRecord;

            store && store.remove(record);
        }
    },

    onStoreRefresh: function () {
        var me = this,
            grid = me.getView(),
            store = grid.getStore(),
            items = [];

        grid.down('button[itemId="delete"]').setDisabled(
            Ext.Object.getKeys(grid.selectedRecords).length === 0
        );

        items.push(Ext.String.format(
            'Count: {0}',
            store.getCount()
        ));

        items.push(Ext.String.format(
            'Selected count: {0}',
            Ext.Object.getKeys(grid.selectedRecords).length
        ));

        items.push(Ext.String.format(
            'Selected sum: {0}',
            (function () {
                var sum = 0;

                Ext.Object.eachValue(grid.selectedRecords, function (record) {
                    sum += Financial.util.Currency.convertToDefault(record.get('sum'), record.get('currency_id'));
                });

                return Ext.String.format(
                    '{0} {1}',
                    Financial.util.Format.money(sum),
                    Financial.util.Currency.getDefaultCurrency().get('symbol')
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

        delete this.newRecord;

        if (record.get('users').length === 0) {
            record.set(
                'users',
                Financial.util.User.getAllIds()
            );
        }

        record.store.sync();
    },

    onCancelRowEditing: function (rowEditing, context) {
        var record = context.record;

        if (record === this.newRecord) {
            this.removeNewRecordFromStore();
        }
    },

    onDeleteSelectedExpensesClick: function () {
        var grid = this.getView(),
            store = grid.getStore();

        Ext.Msg.show({
            title: 'Delete Expense?',
            message: 'Are you sure you want to delete these expenses?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    store.remove(Ext.Object.getValues(grid.selectedRecords));
                    store.sync();

                    grid.selectedRecords = {};
                    grid.store.fireEvent('refresh');
                }
            }
        });
    },

    onSelectDeselectRecord: function (a, b, c, e, event) {
        var grid = this.getView(),
            record = event.record,
            id = record.get('id');

        if (grid.selectedRecords[id]) {
            delete grid.selectedRecords[id];
        } else {
            grid.selectedRecords[id] = record;
        }

        Ext.defer(function () {
            grid.store.fireEvent('refresh');
        });
    },

    onMarkExpenseAsPendingClick: function (a, b, c, e, event) {
        this.markExpenseAs('pending', event);
    },

    onMarkExpenseAsFinishedClick: function (a, b, c, e, event) {
        this.markExpenseAs('finished', event);
    },

    onAddExpenseClick: function (button) {
        var grid = button.up('grid'),
            rowEditing = grid.getPlugin();

        rowEditing.cancelEdit();

        var record = Ext.create('Financial.model.Expense', {
            currency_id: Financial.util.Currency.getDefaultCurrency().get('id'),
            created_at: Financial.util.Misc.generateEICreationDate(grid),
            users: [Financial.data.user.current.id],
            status: 'pending'
        });

        this.newRecord = record;

        grid.getStore().insert(0, record);

        rowEditing.startEdit(record, 1);
    },

    onBeforeRowEditing: function (rowEditing, context) {
        var record = context.record,
            editor = rowEditing.getEditor();

        if (this.newRecord !== record && this.newRecord) {
            this.removeNewRecordFromStore();
            setTimeout(function () {
                rowEditing.startEdit(record, 1);
            }, 0);
        } else {
            editor.down('[itemId="update"]').setText(
                this.newRecord === record ? 'Add' : 'Update'
            );

            editor.down('datefield').setMinValue(Financial.app.getController('Data').getStartDate());
            editor.down('datefield').setMaxValue(Financial.app.getController('Data').getEndDate());
        }
    }
});