Ext.define('Financial.view.main.internal.data.incomes.IncomesGrid', {
    extend: 'Ext.grid.Panel',
    store: 'Financial.store.Income',
    xtype: 'app-main-internal-data-incomes-grid',
    controller: 'app-main-internal-data-incomes-grid',
    autoScroll: true,
    viewConfig: {
        loadMask: false
    },
    bufferedRenderer: false,

    requires: [
        'Financial.view.main.internal.data.incomes.IncomesGridController'
    ],

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
            text: 'Add Income',
            iconCls: 'icon-money_add',
            handler: 'addRecord'
        }
    ],

    columns: [
        {
            dataIndex: 'sum',
            text: 'Sum',
            flex: 1,
            align: 'right',
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
            renderer: function(value, metaData, record) {
                var currency = Financial.data.Currency.getDefaultCurrency();

                Financial.util.Misc.anotherCurrenciesTooltip(
                    metaData,
                    currency,
                    record
                );

                return Financial.util.Format.money(value) + ' ' + currency.get('symbol');
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
            formatter: "date('D d-m-Y')",
            width: 115,
            resizable: false,
            align: 'center',
            editor: {
                xtype: 'datefield',
                format: 'd-m-Y',
                altFormats: 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/n/Y|d-m-y|d/m|d-m|dm|dmy|dmY|d|Y-m-d|j-n|j/n',
                startDay: 1
            }
        },
        {
            dataIndex: 'user_id',
            text: 'From',
            flex: 1,
            renderer: function (userId) {
                return Financial.data.User.getById(userId).get('full_name');
            },
            editor: {
                xtype: 'combo',
                valueField: 'id',
                displayField: 'full_name',
                itemId: 'user',
                queryMode: 'local',
                typeAhead: true,
                allowBlank: false,
                forceSelection: true,
                store: Financial.data.User.getStore()
            }
        },
        {
            xtype: 'actioncolumn',
            editor: {
                xtype: 'label',
                text: ''
            },
            items: [
                {
                    iconCls: 'icon-delete',
                    tooltip: 'Delete',
                    handler: 'onDeleteIncomeClick'
                }
            ],
            width: 26
        }
    ]
});