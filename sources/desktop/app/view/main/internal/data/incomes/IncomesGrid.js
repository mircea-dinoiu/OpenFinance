Ext.define('Financial.view.main.internal.data.incomes.IncomesGrid', {
    extend: 'Ext.grid.Panel',
    store: 'Financial.store.IncomeStore',
    xtype: 'app-main-internal-data-incomes-grid',
    controller: 'app-main-internal-data-incomes-grid',
    autoScroll: true,
    bufferedRenderer: false,

    requires: [
        'Financial.view.main.internal.data.incomes.IncomesGridController'
    ],

    viewConfig: {
        getRowClass: function (record) {
            function day(date) {
                return Ext.util.Format.date(date, 'Y-m-d');
            }

            var classes = [];

            if (day(record.get('created_at')) === day(new Date())) {
                classes.push('today-row');
            } else if (day(record.get('created_at')) > day(new Date())) {
                classes.push('future-row');
            }

            return classes.join(' ');
        },
        listeners: {
            refresh: function (dataView) {
                Financial.util.Events.dataViewAutoFit(dataView);
            }
        },
        loadMask: false
    },

    plugins: [
        {
            ptype: 'rowediting',
            listeners: {
                canceledit: 'onCancelRowEditing',
                beforeedit: 'onBeforeRowEditing',
                edit: 'onRowEditing'
            }
        },
        {
            ptype: 'gridfilters'
        }
    ],

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
            resizable: false,
            fit: true,
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
            renderer: function (value, metaData, record) {
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
            },
            filter: {
                type: 'string'
            }
        },
        {
            dataIndex: 'created_at',
            text: 'Date',
            formatter: "date('D d-m-Y')",
            fit: true,
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
            align: 'center',
            resizable: false,
            fit: true,
            renderer: function (userId) {
                return Financial.util.Format.userIcon(userId);
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
            },
            filter: {
                type: 'list',
                store: Financial.data.User.getStore(),
                labelField: 'full_name'
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
            resizable: false,
            fit: true
        }
    ]
});