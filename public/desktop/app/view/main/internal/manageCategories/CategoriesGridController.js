Ext.define('Financial.view.main.internal.manageCategories.CategoriesGridController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.app-main-internal-manageCategories-grid',

    newRecord: undefined,

    removeNewRecordFromStore: function () {
        if (this.newRecord) {
            var record = this.newRecord,
                store = record.store;

            delete this.newRecord;

            store && store.remove(record);
        }
    },

    onCancelRowEditing: function (rowEditing, context) {
        var record = context.record;

        if (record === this.newRecord) {
            this.removeNewRecordFromStore();
        }
    },

    onBeforeRowEditing: function (rowEditing, context) {
        var record = context.record;

        if (this.newRecord !== record && this.newRecord) {
            this.removeNewRecordFromStore();
            setTimeout(function () {
                rowEditing.startEdit(record);
            }, 0);
        }
    },

    onRowEditing: function (rowEditing, context) {
        var record = context.record;

        delete this.newRecord;

        record.store.sync();
    },

    onAddCategoryClick: function (button) {
        var grid = button.up('grid'),
            rowEditing = grid.getPlugin();

        rowEditing.cancelEdit();

        var record = Ext.create('Financial.model.Category');

        this.newRecord = record;

        grid.getStore().insert(0, record);

        rowEditing.startEdit(record, 1);
    }
});