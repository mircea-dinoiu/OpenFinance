Ext.define('Financial.base.FinancialGridViewController', {
    extend: 'Financial.base.GridViewController',

    onBeforeRowEditing: function (rowEditing, context) {
        if (context.record.isGenerated()) {
            return false;
        }

        return this.callParent(arguments);
    },

    onDuplicateSelectedRecordsClick: function () {
        var grid = this.getView();
        var store = grid.getStore();

        Ext.each(grid.getSelection(), function (record) {
            var copy = record.copy(null);

            copy.set('status', 'pending');
            
            store.add(copy);
        });

        store.sync();
    },

    onDeleteSelectedRecordsClick: function () {
        var capitalize = Ext.util.Format.capitalize;
        var format = Ext.String.format;

        var me = this,
            grid = me.getView(),
            store = grid.getStore(),
            selection = grid.getSelection(),
            name = grid.itemName;

        Ext.Msg.show({
            title: format('Delete {0}?', capitalize(selection.length > 1 ? format('{0}s', name) : name)),
            message: format('Are you sure you want to delete {0}?', selection.length > 1 ? format('these {0}s', name) : format('this {0}', name)),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    store.remove(grid.getSelection());
                    store.sync();
                }
            }
        });
    },

    /**
     * STATUS CHANGING OPERATIONS
     */

    setStatusToSelectedRecords: function (status) {
        var grid = this.getView();
        var records = grid.getSelection();
        var store = grid.getStore();

        Ext.each(records, function (record) {
            if (status === 'finished' && record.get('repeat') != null) {
                var copy = record.copy(null);
                var attrs = Financial.util.RepeatedModels.advanceRepeatDate(copy.data);

                copy.set(attrs);

                store.add(copy.data);
            }
            
            record.set('status', status);
        });

        store.sync();

        grid.getView().refresh();
    },

    onMarkSelectionAsPendingClick: function () {
        this.setStatusToSelectedRecords('pending');
    },

    onMarkSelectionAsFinishedClick: function () {
        this.setStatusToSelectedRecords('finished');
    },

    /**
     * ROUND OPERATIONS
     */

    applyMathMethodOnSelectedRecords: function (method) {
        var grid = this.getView();
        var records = grid.getSelection();

        Ext.each(records, function (record) {
            record.set('sum', Math[method](record.get('sum')));
        });

        grid.getStore().sync();
    },

    onRoundRecordSumClick: function () {
        this.applyMathMethodOnSelectedRecords('round');
    },

    onFloorRecordSumClick: function () {
        this.applyMathMethodOnSelectedRecords('floor');
    },

    onCeilRecordSumClick: function () {
        this.applyMathMethodOnSelectedRecords('ceil');
    }
});