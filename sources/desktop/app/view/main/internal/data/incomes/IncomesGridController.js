Ext.define('Financial.view.main.internal.data.incomes.IncomesGridController', {
    extend: 'Financial.base.GridViewController',

    alias: 'controller.app-main-internal-data-incomes-grid',

    addRecord: function () {
        this.newRecordData = {
            created_at: Financial.util.Misc.generateEICreationDate(this.getView()),
            user_id: Financial.data.user.current.id
        };
        this.callParent(arguments);
    },

    onDeleteIncomeClick: function (a, b, c, e, event) {
        var record = event.record,
            store = record.store;

        Ext.Msg.show({
            title: 'Delete Income?',
            message: 'Are you sure you want to delete this income?',
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

    onBeforeRowEditing: function (rowEditing, context) {
        var editor = rowEditing.getEditor();

        this.callParent(arguments);

        editor.down('datefield').setMinValue(Financial.app.getController('Data').getStartDate());
        editor.down('datefield').setMaxValue(Financial.app.getController('Data').getEndDate());
    }
});