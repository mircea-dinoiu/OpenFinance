Ext.define('Financial.view.main.internal.data.incomes.GridController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.app-main-internal-data-incomes-grid',

    onAddIncomeClick: function (button) {
        var grid = button.up('grid'),
            rowEditing = grid.getPlugin();

        rowEditing.cancelEdit();

        var newEntry = Ext.create('Financial.model.Income', {
            id: 0,
            sum: 1,
            created_at: new Date()
        });

        grid.getStore().insert(0, newEntry);

        rowEditing.startEdit(0, 0);
    },

    onCancelRowEditing: function (rowEditing, context) {
        var record = context.record;

        if (record.get('id') === 0) {
            record.store.remove(record);
        }
    },

    onBeforeRowEditing: function (rowEditing, context) {
        var record = context.record,
            editor = rowEditing.getEditor();

        editor.down('[itemId="update"]').setText(
            record.get('id') === 0 ? 'Add' : 'Update'
        );

        editor.down('combo[itemId="user"]').setStore(Financial.data.user.store);
    },

    onRowEditing: function (rowEditing, context) {
        var record = context.record,
            editor = rowEditing.getEditor();

        console.log(record);
        //record.set('users', editor.down('combo[itemId="users"]').getValue());
    }
});