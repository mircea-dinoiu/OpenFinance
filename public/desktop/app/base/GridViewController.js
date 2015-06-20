Ext.define('Financial.base.GridViewController', {
    extend: 'Ext.app.ViewController',

    removeNewRecordFromStore: function () {
        if (this.newRecord) {
            var record = this.newRecord,
                store = record.store;

            delete this.newRecord;

            store && store.remove(record);
        }
    },

    onRowEditing: function (rowEditing, context) {
        delete this.newRecord;

        context.record.store.sync();
    },

    onCancelRowEditing: function (rowEditing, context) {
        var record = context.record;

        if (record === this.newRecord) {
            this.removeNewRecordFromStore();
        }
    },

    onBeforeRowEditing: function (rowEditing, context) {
        var record = context.record,
            editor = rowEditing.getEditor(),

            updateBtn = editor.down('[itemId="update"]'),
            cancelBtn = editor.down('[itemId="cancel"]');

        updateBtn.setText(
            this.newRecord === record ? 'Add' : 'Update'
        );
        updateBtn.setIconCls(
            this.newRecord === record ? 'icon-add' : 'icon-disk'
        );

        cancelBtn.setIconCls('icon-cancel');
    },

    addRecord: function (button) {
        var grid = button.up('grid'),
            rowEditing = grid.getPlugin();

        rowEditing.cancelEdit();

        var record = Ext.create(grid.store.config.model, this.newRecordData || {});

        delete this.newRecordData;
        this.newRecord = record;

        grid.getStore().insert(0, record);
        grid.getView().getRowByRecord(record).scrollIntoView(grid, false);

        rowEditing.startEdit(record, this.newRecordEditAt || 0);
        delete this.newRecordEditAt;
    }
});