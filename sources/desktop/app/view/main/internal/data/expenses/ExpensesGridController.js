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
            created_at: Financial.util.Misc.generateEICreationDate(button),
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

        var endDate = Financial.app.getController('Data').getEndDate();

        editor.down('datefield').setMaxValue(endDate);
        editor.down('combo[itemId="item"]').setStore(new Ext.data.JsonStore({
            fields: ['item', 'usages'],
            proxy: {
                type: 'ajax',
                url: Financial.routes.suggestion.expense.descriptions,
                reader: {
                    type: 'json'
                },
                extraParams: {
                    end_date: endDate
                }
            }
        }));
    },

    onItemInputBlur: function (input) {
        var rowEditor = input.up('roweditor');
        var categoriesCombo = rowEditor.down('combo[itemId="categories"]');
        var value = (input.getValue() || '').toLowerCase().trim();

        if (value.length === 0) {
            return;
        }

        Ext.Ajax.request({
            url: Financial.routes.suggestion.expense.categories,
            method: 'GET',
            params: {
                search: value,
            },
            success: function (response) {
                var json = JSON.parse(response.responseText);

                categoriesCombo.setValue(json);
            }
        });
    }
});