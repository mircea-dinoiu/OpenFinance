Ext.define('Financial.view.main.internal.data.expenses.ExpensesGridController', {
    extend: 'Financial.base.FinancialGridViewController',

    alias: 'controller.app-main-internal-data-expenses-grid',

    onStoreRefresh: function () {
        var me = this,
            grid = me.getView(),
            store = grid.getStore(),
            items = [];

        /**
         * Toggle buttons depending on selected records
         */
        Ext.each(['deselect'], function (itemId) {
            grid.down(Ext.String.format('button[itemId="{0}"]', itemId)).setDisabled(
                grid.getSelection().length === 0
            );
        });

        /**
         * Create bottom bar text
         */
        items.push(Ext.String.format(
            'Count: {0}',
            store.getCount()
        ));

        items.push(Ext.String.format(
            'Selected count: {0}',
            grid.getSelection().length
        ));

        items.push(Ext.String.format(
            'Selected sum: {0}',
            (function () {
                var sum = 0;

                Ext.each(grid.getSelection(), function (record) {
                    sum += Financial.data.Currency.convertToDefault(record.get('sum'), record.get('currency_id'));
                });

                return Ext.String.format(
                    '{0} {1}',
                    Financial.util.Format.money(sum),
                    Financial.data.Currency.getDefaultCurrency().get('symbol')
                );
            }())
        ));

        grid.down('[itemId="statistics"]').setText(items.join(', '));
    },

    onRowEditing: function (rowEditing, context) {
        var record = context.record;

        if (record.get('users').length === 0) {
            record.set(
                'users',
                Financial.data.User.getAllIds()
            );
        }

        this.callParent(arguments);

        this.onStoreRefresh();
    },

    onDeselectAllClick: function () {
        this.deselectAll();
    },

    deselectAll: function () {
        var grid = this.getView();

        grid.getSelectionModel().deselectAll();
    },

    onSelectionChange: function () {
        this.onStoreRefresh();
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
                items[rawName] = {item: record.get('item')};
            }
        });
        editor.down('combo[itemId="item"]').setStore(new Ext.data.JsonStore({
            fields: ['item'],
            data: Ext.Object.getValues(items)
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