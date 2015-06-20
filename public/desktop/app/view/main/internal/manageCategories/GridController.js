Ext.define('Financial.view.main.internal.manageCategories.GridController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.app-main-internal-manageCategories-grid',

    newRecord: undefined,

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