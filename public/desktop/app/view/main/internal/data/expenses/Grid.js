Ext.define('Financial.view.main.internal.data.expenses.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'app-main-internal-data-expenses-grid',
    store: 'Financial.store.Expense',
    controller: 'app-main-internal-data-expenses-grid',
    autoScroll: true,
    requires: [
        'Financial.view.main.internal.data.expenses.GridController'
    ],

    viewConfig: {
        getRowClass: function (record) {
            return record.get('status') + '-expense-row';
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
            ptype: 'rowexpander',
            rowBodyTpl: [
                // TODO THIS IS A HACK!? IMPROVE CODE PLEASE
                '<p><strong>Sum for other currencies: </strong>{currency_id:this.prepareCurrency}{sum:this.getOtherCurrencies}</p>',
                {
                    prepareCurrency: function (currencyId) {
                        this.currencyId = currencyId;
                        return '';
                    },
                    getOtherCurrencies: function (sum) {
                        var ret = [],
                            currency = Financial.util.Currency.getCurrencyById(this.currencyId);

                        Ext.Object.each(currency.get('rates'), function (isoCode, multiplier) {
                            ret.push('<i>' + [
                                Financial.util.Format.money(sum * multiplier),
                                Financial.util.Currency.getCurrencyByISOCode(isoCode).get('symbol')
                            ].join(' ') + '</i>');
                        });

                        return ret.join(', ');
                    }
                }
            ]
        }
    ],

    tbar: [
        {
            text: 'Add Expense',
            iconCls: 'icon-basket_put',
            handler: 'onAddExpenseClick'
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
                        itemId: 'sum',
                        allowBlank: false,
                        validator: function (value) {
                            if (parseFloat(value) === 0) {
                                return 'The value must be different than 0';
                            }

                            return true;
                        },
                        value: ''
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
                        forceSelection: true,
                        tabIndex: -1
                    },
                    renderer: function (value) {
                        return Financial.util.Currency.getCurrencyById(value).get('symbol');
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
            formatter: "date('D d-m-Y')",
            width: 115,
            resizable: false,
            editor: {
                xtype: 'datefield',
                format: 'd-m-Y',
                altFormats: 'd/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/n/Y|d-m-y|d/m|d-m|dm|dmy|dmY|d|Y-m-d|j-n|j/n',
                startDay: 1
            }
        },
        {
            text: 'Blame',
            dataIndex: 'users',
            flex: 2,
            renderer: function (ids) {
                var ret = [];

                Financial.data.user.store.each(function (user) {
                    if (ids.indexOf(user.id) !== -1) {
                        ret.push(user.get('first_name') + ' ' + user.get('last_name').substr(0, 1));
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
                forceSelection: true
            }
        },
        {
            text: 'Categories',
            dataIndex: 'categories',
            flex: 2,
            renderer: function (ids) {
                var ret = [];

                Financial.util.Category.getStore().each(function (category) {
                    if (ids.indexOf(category.get('id')) !== -1) {
                        ret.push(category.get('name'));
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
            editor: {
                xtype: 'label',
                text: ''
            },
            items: [
                {
                    tooltip: 'Flag as finished',
                    getClass: function (v, metadata, record) {
                        return record.get('status') === 'finished' ? ' hidden ' : ' icon-flag_green ';
                    },
                    handler: 'onMarkExpenseAsFinishedClick'
                },
                {
                    tooltip: 'Flag as pending',
                    getClass: function (v, metadata, record) {
                        return record.get('status') === 'pending' ? ' hidden ' : ' icon-flag_yellow ';
                    },
                    handler: 'onMarkExpenseAsPendingClick'
                },
                {
                    iconCls: ' icon-delete ',
                    tooltip: 'Delete',
                    handler: 'onDeleteExpenseClick'
                }
            ],
            width: 16 * 2 + 4 * 2
        }
    ]
});