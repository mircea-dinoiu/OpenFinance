Ext.define('Financial.view.main.internal.data.expenses.Grid', {
    extend: 'Ext.grid.Panel',

    requires: [
        'Financial.view.main.internal.data.expenses.GridController'
    ],

    xtype: 'app-main-internal-data-expenses-grid',

    store: 'Financial.store.Expense',

    controller: 'app-main-internal-data-expenses-grid',

    autoScroll: true,

    viewConfig: {
        getRowClass: function (record) {
            return record.get('status') + '-expense-row';
        }
    },

    plugins: {
        ptype: 'rowediting',
        listeners: {
            canceledit: 'onCancelRowEditing',
            beforeedit: 'onBeforeRowEditing',
            edit: 'onRowEditing'
        }
    },

    tbar: [
        {
            text: 'Add Expense',
            iconCls: 'icon-add',
            handler: 'onAddExpenseClick'
        },
        {
            xtype: 'tbfill'
        },
        {
            xtype: 'textfield',
            listeners: {
                keypress: function (textField) {
                    // todo
                    //store.filterBy(function (record) { return true; });
                }
            }
        }
    ],

    bbar: [
        {
            xtype: 'tbtext',
            itemId: 'expensesStats'
        }
    ],

    initComponent: function () {
        var me = this;

        this.callParent(arguments);
        this.store.on('load', function () {
            me.down('[itemId="expensesStats"]').setText(Ext.String.format(
                'Count: {0}',
                me.store.getCount()
            ));
        });
    },

    columns: [
        {
            text: 'Sum',
            columns: [
                {
                    text: 'Value',
                    dataIndex: 'sum',
                    flex: 1,
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false,
                        validator: function (value) {
                            if (parseFloat(value) === 0) {
                                return 'The value must be different than 0';
                            }

                            return true;
                        }
                    },
                    minWidth: 85,
                    align: 'right'
                },
                {
                    text: 'Curr.',
                    dataIndex: 'currency_id',
                    width: 70,
                    editor: {
                        xtype: 'combo',
                        valueField: 'id',
                        displayField: 'symbol',
                        itemId: 'currency',
                        queryMode: 'local',
                        typeAhead: true,
                        allowBlank: false,
                        forceSelection: true
                    },
                    renderer: function (value) {
                        return Financial.data.currency.map[value].symbol;
                    }
                }
            ]
        },
        {
            text: 'Item',
            dataIndex: 'item',
            flex: 4,
            editor: {
                xtype: 'textfield',
                allowOnlyWhitespace: false
            }
        },
        {
            text: 'Date',
            dataIndex: 'created_at',
            formatter: "date('D Y-m-d')",
            width: 115,
            resizable: false,
            editor: 'datefield'
        },
        {
            text: 'Blame',
            dataIndex: 'users',
            flex: 2,
            renderer: function (ids) {
                var ret = [];

                Ext.each(Financial.data.user.list, function (user) {
                    if (ids.indexOf(user.id) !== -1) {
                        ret.push(user.first_name + ' ' + user.last_name.substr(0, 1));
                    }
                });

                return ret.join(', ');
            },
            editor: {
                xtype: 'combo',
                itemId: 'users',
                valueField: 'id',
                displayField: 'full_name',
                multiSelect: true,
                queryMode: 'local',
                allowBlank: false,
                forceSelection: true
            }
        },
        {
            text: 'Categories',
            dataIndex: 'categories',
            flex: 2,
            renderer: function (ids) {
                var ret = [];

                Ext.each(Financial.data.category.list, function (category) {
                    if (ids.indexOf(category.id) !== -1) {
                        ret.push(category.name);
                    }
                });

                return ret.join(', ');
            },
            editor: {
                xtype: 'combo',
                itemId: 'categories',
                valueField: 'id',
                displayField: 'name',
                multiSelect: true,
                queryMode: 'local'
            }
        },
        {
            xtype: 'actioncolumn',
            items: [
                {
                    // Prepend iconCls with space, bug in ExtJS: class is disabledicon-accept when item is disabled
                    iconCls: ' icon-accept',
                    tooltip: 'Mark as finished',
                    isDisabled: function (a, b, c, d, record) {
                        return record.get('status') === 'finished';
                    }
                },
                {
                    iconCls: ' icon-delete',
                    tooltip: 'Delete',
                    isDisabled: function (a, b, c, d, record) {
                        return record.get('status') === 'finished';
                    }
                }
            ],
            width: 16 * 2 + 4 * 2
        }
    ]
});