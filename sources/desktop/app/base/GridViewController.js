Ext.define('Financial.base.GridViewController', {
    extend: 'Ext.app.ViewController',

    removeNewRecordFromStore: function () {
        if (this.newRecord) {
            var record = this.newRecord,
                store = record.store;

            delete this.newRecord;

            if (store != null) {
                store.remove(record);
            }
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
            this.newRecord === record ? 'x-fa fa-plus-circle' : 'x-fa fa-floppy-o'
        );

        cancelBtn.setIconCls('x-fa fa-ban');

        rowEditing.grid.getView().getScrollable().on('scrollstart', rowEditing.cancelEdit, rowEditing, {single: true});
    },

    addRecord: function (button) {
        var grid = button.up('grid');
        var store = grid.getStore();
        var collapsiblePanel = grid.up('[collapsible=true]');
        var rowEditing = grid.getPlugin();
        var tableView = grid.getView();

        // Force expand collapsible panel if collapsed
        if (collapsiblePanel) {
            collapsiblePanel.expand(false);
        }

        rowEditing.cancelEdit();

        var record = Ext.create(store.config.model, this.newRecordData || {});

        delete this.newRecordData;
        this.newRecord = record;

        store.insert(0, record);
        tableView.getScrollable().suspendEvents();
        tableView.bufferedRenderer.scrollTo(store.indexOf(record));

        rowEditing.startEdit(record, this.newRecordEditAt || 0);
        delete this.newRecordEditAt;

        setTimeout(function () {
            tableView.getScrollable().resumeEvents();
        }, 0);
    }
});