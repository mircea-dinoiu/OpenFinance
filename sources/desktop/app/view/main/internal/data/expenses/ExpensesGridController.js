Ext.define('Financial.view.main.internal.data.expenses.ExpensesGridController', {
    extend: 'Financial.base.FinancialGridViewController',

    alias: 'controller.app-main-internal-data-expenses-grid',

    onRowEditing: function (rowEditing, context) {
        var record = context.record;

        if (record.get('users').length === 0) {
            record.set(
                'users',
                Financial.data.User.getAllIds()
            );
        }

        this.callParent(arguments);
    },

    addRecord: function (button) {
        this.newRecordData = {
            currency_id: Financial.data.Currency.getDefaultCurrency().get('id'),
            created_at: Financial.util.Misc.generateEICreationDate(button.up('grid')),
            users: [Financial.data.user.current.id]
        };
        this.newRecordEditAt = 1;

        this.callParent(arguments);
    },

    onBeforeRowEditing: function (rowEditing) {
        var editor = rowEditing.getEditor();

        if (this.callParent(arguments) === false) {
            return false;
        }

        editor.down('datefield').setMaxValue(Financial.app.getController('Data').getEndDate());

        var items = {};

        Financial.data.Expense.getStore().each(function (record) {
            var rawName = record.get('item').toLowerCase().trim();

            if (items[rawName] == null) {
                items[rawName] = {item: record.get('item'), usages: 1};
            } else {
                items[rawName].usages++;
            }
        });
        editor.down('combo[itemId="item"]').setStore(new Ext.data.JsonStore({
            fields: ['item'],
            data: _.sortBy(Ext.Object.getValues(items), 'usages').reverse()
        }));
    },

    onItemInputBlur: function (input) {
        var rowEditor = input.up('roweditor');
        var categoriesCombo = rowEditor.down('combo[itemId="categories"]');
        var value = input.getValue().toLowerCase().trim();

        Financial.data.Expense.getStore().each(function (record) {
            var rawName = record.get('item').toLowerCase().trim();

            if (rawName == value) {
                var recordCategories = record.get('categories');

                if (recordCategories.length) {
                    categoriesCombo.setValue(recordCategories);
                    return false;
                }
            }
        });
    }
});