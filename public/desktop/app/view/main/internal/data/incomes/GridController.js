Ext.define('Financial.view.main.internal.data.incomes.GridController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.app-main-internal-data-incomes-grid',

    newRecord: undefined,

    removeNewRecordFromStore: function () {
        if (this.newRecord) {
            var record = this.newRecord,
                store = record.store;

            delete this.newRecord;

            store && store.remove(record);
        }
    },

    onAddIncomeClick: function (button) {
        var grid = button.up('grid'),
            rowEditing = grid.getPlugin();

        rowEditing.cancelEdit();

        var record = Ext.create('Financial.model.Income', {
            created_at: Financial.util.Misc.generateEICreationDate(grid),
            user_id: Financial.data.user.current.id
        });

        this.newRecord = record;

        grid.getStore().insert(0, record);

        rowEditing.startEdit(record);
    },

    onDeleteIncomeClick: function (a, b, c, e, event) {
        var record = event.record,
            store = record.store;

        Ext.Msg.show({
            title: 'Delete Income?',
            message: 'Are you sure you want to delete this income?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'yes') {
                    store.remove(record);
                    store.sync();
                }
            }
        });
    },

    onCancelRowEditing: function (rowEditing, context) {
        var record = context.record;

        if (record === this.newRecord) {
            this.removeNewRecordFromStore();
        }
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

            editor.down('datefield').setMinValue(Financial.app.getController('Data').getStartDate());
            editor.down('datefield').setMaxValue(Financial.app.getController('Data').getEndDate());
        }
    },

    onRowEditing: function (rowEditing, context) {
        var record = context.record;

        delete this.newRecord;

        record.store.sync();
    }
});