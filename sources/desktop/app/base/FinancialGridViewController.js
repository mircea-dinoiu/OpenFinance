Ext.define('Financial.base.FinancialGridViewController', {
    extend: 'Financial.base.GridViewController',

    onAddRecordMenuShow: function (menu) {
        menu.items.each(function (item) {
            item.setDisabled(false);
            item.setTooltip('');

            if (null == Financial.util.Misc.generateEICreationDate(item)) {
                item.setDisabled(true);
                item.setTooltip('This option is not available for the current date range filter value');
            }
        });
    },

    onRowContextMenuShow: function (menu) {
        menu.down('[itemId="paste-column-value"]').setDisabled(this.clipboard == null);
    },

    onBeforeRowEditing: function (rowEditing, context) {
        if (context.record.isGenerated()) {
            return false;
        }

        return this.callParent(arguments);
    },

    onDeselectAllClick: function () {
        this.deselectAll();
    },

    deselectAll: function () {
        var grid = this.getView();

        grid.getSelectionModel().deselectAll();
    },

    onRowEditing: function () {
        this.callParent(arguments);

        this.onStoreRefresh();
    },

    togglePending: function (checkbox, value) {
        var store = this.getView().getStore();
        var filter = this.pendingFilter ? this.pendingFilter : new Ext.util.Filter({
            property: 'status',
            value: 'pending'
        });

        if (value === true) {
            store.addFilter(filter);
        } else {
            store.removeFilter(filter);
            this.pendingFilter = null;
        }
    },

    onSelectionChange: function () {
        this.onStoreRefresh();
    },

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
                    var recordSum = record.get('sum');
                    var recordCurrency = record.get('currency_id');

                    sum += recordCurrency != null ? Financial.data.Currency.convertToDefault(recordSum, recordCurrency) : recordSum;
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

    onDetachClick: function () {
        var grid = this.getView();
        var records = grid.getSelection();
        var store = grid.getStore();
        var endDate = Financial.app.getController('Data').getEndDate();
        var day = Financial.util.Misc.day;

        Ext.each(records, function (record) {
            if (record.get('repeat') != null) {
                var copy = record.copy(null);
                var attrs = Financial.util.RepeatedModels.advanceRepeatDate(copy.data);

                copy.set(attrs);

                if (day(endDate) >= day(attrs.created_at)) {
                    store.add(copy.data);
                } else {
                    copy.save();
                }

                record.set('repeat', null);
            }
        });

        store.sync();
    },

    /**
     * STATUS CHANGING OPERATIONS
     */

    setStatusToSelectedRecords: function (status) {
        var grid = this.getView();
        var records = grid.getSelection();
        var store = grid.getStore();

        Ext.each(records, function (record) {
            record.set('status', status);
        });

        store.sync();
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
    },

    /**
     * COPY OPERATIONS
     */
    onCopyColumnValueClick: function (item) {
        var selection = this.getView().getSelection();
        var record = selection[0];

        this.clipboard = {
            dataIndex: item.dataIndex,
            value: record.get(item.dataIndex)
        };

        if (selection.length > 1) {
            Ext.Msg.alert(
                'Warning',
                Ext.String.format(
                    'Only one value can be copied into clipboard.<br>The value of the column "{0}" was copied only for "{1}".',
                    item.text,
                    record.get('item')
                )
            );
        }
    },

    onPasteColumnValueClick: function () {
        var grid = this.getView();

        grid.getSelection().forEach(function (record) {
            record.set(this.clipboard.dataIndex, this.clipboard.value);
        }.bind(this));

        grid.getStore().sync();

        this.clipboard = null;
    },

    onCopyColumnValueMenuShow: function (menu) {
        if (menu.items.length === 0) {
            var grid = this.getView();

            grid.getColumns().forEach(function (column) {
                var data = {
                    dataIndex: column.dataIndex,
                    text: column.text
                };

                menu.add(Ext.create('Ext.menu.Item', data));
            });
        }
    }
});