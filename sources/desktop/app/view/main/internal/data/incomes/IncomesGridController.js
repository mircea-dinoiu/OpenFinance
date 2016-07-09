Ext.define('Financial.view.main.internal.data.incomes.IncomesGridController', {
    extend: 'Financial.base.FinancialGridViewController',

    alias: 'controller.app-main-internal-data-incomes-grid',

    addRecord: function (button) {
        this.newRecordData = {
            created_at: Financial.util.Misc.generateEICreationDate(button),
            user_id: Financial.data.user.current.id
        };
        this.callParent(arguments);
    },

    onBeforeRowEditing: function (rowEditing) {
        var editor = rowEditing.getEditor();

        if (this.callParent(arguments) === false) {
            return false;
        }

        editor.down('datefield').setMaxValue(Financial.app.getController('Data').getEndDate());
    }
});