Ext.define('Financial.view.main.internal.data.expenses.GridController', {
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

    onDeleteExpenseClick: function (a, b, c, e, event) {
        var record = event.record,
            store = record.store;

        Ext.Msg.show({
            title: 'Delete Expense?',
            message: 'Are you sure you want to delete this expense?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    store.remove(record);
                    store.sync();
                }
            }
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
            currency_id: Financial.data.currency.default.id,
            created_at: Financial.util.Misc.generateEICreationDate(grid),
            users: [Financial.data.user.current.id],
            status: 'pending'
        });

        this.newRecord = record;

        grid.getStore().insert(0, record);

        rowEditing.startEdit(record);
    },

    onBeforeRowEditing: function (rowEditing, context) {
        var record = context.record,
            editor = rowEditing.getEditor();

        if (this.newRecord !== record && this.newRecord) {
            this.removeNewRecordFromStore();
            setTimeout(function () {
                rowEditing.startEdit(record);
            }, 0);
        } else {
            editor.down('[itemId="update"]').setText(
                this.newRecord === record ? 'Add' : 'Update'
            );

            editor.down('combo[itemId="currency"]').setStore(Financial.data.currency.store);
            editor.down('combo[itemId="categories"]').setStore(Financial.data.category.store);
            editor.down('combo[itemId="users"]').setStore(Financial.data.user.store);
            editor.down('datefield').setMinValue(Financial.app.getController('Data').getStartDate());
            editor.down('datefield').setMaxValue(Financial.app.getController('Data').getEndDate());
            editor.down('numberfield[itemId="sum"]').setValue(5);
        }
    }
});