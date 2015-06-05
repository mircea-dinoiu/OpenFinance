Ext.define('Financial.view.main.internal.data.incomes.Grid', {
    extend: 'Ext.grid.Panel',
    store: 'Financial.store.Income',
    xtype: 'app-main-internal-data-incomes-grid',
    autoScroll: true,
    controller: 'app-main-internal-data-incomes-grid',
    viewConfig: {
        loadMask: false
    },

    requires: [
        'Financial.view.main.internal.data.incomes.GridController'
    ],

    plugins: {
        ptype: 'rowediting',
        listeners: {
            canceledit: 'onCancelRowEditing',
            beforeedit: 'onBeforeRowEditing',
            edit: 'onRowEditing'
        }
    },

    features: [
        {
            groupHeaderTpl: '{name}',
            hideGroupedHeader: true,
            showSummaryRow: false,
            ftype: 'groupingsummary'
        }
    ],

    tbar: [
        {
            text: 'Add Income',
            iconCls: 'icon-add',
            handler: 'onAddIncomeClick'
        }
    ],

    columns: [
        {
            dataIndex: 'sum',
            text: 'Sum',
            flex: 1,
            renderer: function (value) {
                return value + ' ' + Financial.data.currency.default.symbol;
            },
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                validator: function (value) {
                    if (parseFloat(value) === 0) {
                        return 'The value must be different than 0';
                    }

                    return true;
                }
            }
        },
        {
            dataIndex: 'description',
            text: 'Desc.',
            flex: 1,
            editor: {
                xtype: 'textfield',
                allowOnlyWhitespace: false
            }
        },
        {
            dataIndex: 'created_at',
            text: 'Date',
            formatter: "date('D Y-m-d')",
            width: 115,
            resizable: false,
            editor: 'datefield'
        },
        {
            dataIndex: 'user_id',
            text: 'From',
            flex: 1,
            renderer: function (userId) {
                return Financial.util.User.getUserById(userId).full_name;
            },
            editor: {
                xtype: 'combo',
                valueField: 'id',
                displayField: 'full_name',
                itemId: 'user',
                queryMode: 'local',
                typeAhead: true,
                allowBlank: false,
                forceSelection: true
            }
        },
        {
            xtype: 'actioncolumn',
            items: [
                {
                    iconCls: 'icon-delete',
                    tooltip: 'Delete'
                }
            ],
            width: 26
        }
    ]
});