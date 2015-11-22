Ext.define('Financial.view.main.internal.data.expenses.ExpensesGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'app-main-internal-data-expenses-grid',
    store: 'Financial.store.Expense',
    controller: 'app-main-internal-data-expenses-grid',
    autoScroll: true,
    bufferedRenderer: false,

    requires: [
        'Financial.view.main.internal.data.expenses.ExpensesGridController'
    ],

    viewConfig: {
        getRowClass: function (record) {
            function day(date) {
                return Ext.util.Format.date(date, 'Y-m-d');
            }

            var classes = [];

            classes.push(record.get('status') + '-expense-row');
            classes.push('expense-row');

            if (day(record.get('created_at')) === day(new Date())) {
                classes.push('today-row');
            } else if (day(record.get('created_at')) > day(new Date())) {
                classes.push('future-row');
            }

            return classes.join(' ');
        },
        loadMask: false
    },

    selModel: {
        selType: 'rowmodel', // rowmodel is the default selection model
        mode: 'MULTI' // Allows selection of multiple rows
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
            /*createColumnFilter: function (column) {
                var me = this,
                    columnFilter = column.filter,
                    filter = {
                        column: column,
                        grid: me.grid,
                        owner: me
                    },
                    field, model, type;

                if (Ext.isString(columnFilter)) {
                    filter.type = columnFilter;
                } else {
                    Ext.apply(filter, columnFilter);
                }

                if (!filter.type) {
                    model = me.store.getModel();
                    // If no filter type given, first try to get it from the data field.
                    field = model && model.getField(column.dataIndex);
                    type = field && field.type;

                    filter.type = (type && me.defaultFilterTypes[type]) ||
                    column.defaultFilterType || 'string';
                }

                filter.createFilter = function (config, key) {
                    var filterCfg = {};//this.getFilterConfig(config, key);

                    console.log(filterCfg);

                    filterCfg.filterFn = function () {
                        console.log(arguments);
                        return true;
                    };

                    return new Ext.util.Filter(filterCfg);
                };

                column.filter = Ext.Factory.gridFilter(filter);
            }*/
        }
        /*{
         ptype: 'rowexpander',
         expandOnDblClick: false,
         expandOnEnter: false,
         rowBodyTpl: [
         '<hr class="expense-details-separator">',
         // TODO THIS IS A HACK!? IMPROVE CODE PLEASE
         '<div><strong>Sum for other currencies: </strong>{currency_id:this.prepareCurrency}{sum:this.getOtherCurrencies}</div>',
         {
         prepareCurrency: function (currencyId) {
         this.currencyId = currencyId;
         return '';
         },
         getOtherCurrencies: function (sum) {
         var ret = [],
         currency = Financial.data.Currency.getById(this.currencyId);

         Ext.Object.each(currency.get('rates'), function (isoCode, multiplier) {
         ret.push('<i>' + [
         Financial.util.Format.money(sum * multiplier),
         Financial.data.Currency.getCurrencyByISOCode(isoCode).get('symbol')
         ].join(' ') + '</i>');
         });

         return ret.join(', ');
         }
         }
         ]
         }*/
    ],

    tbar: [
        {
            text: 'Add Expense',
            iconCls: 'icon-cart_add',
            handler: 'addRecord'
        },
        {
            xtype: 'tbfill'
        },
        {
            text: 'Deselect All',
            handler: 'onDeselectAllClick',
            itemId: 'deselect',
            disabled: true
        },
        {
            text: 'Delete',
            iconCls: 'icon-delete',
            handler: 'onDeleteSelectedExpensesClick',
            itemId: 'delete',
            disabled: true
        }
    ],

    bbar: [
        {
            xtype: 'tbtext',
            itemId: 'statistics'
        }
    ],

    listeners: {
        refresh: {
            element: 'store',
            fn: 'onStoreRefresh'
        },
        selectionchange: 'onSelectionChange'
    },

    columns: [
        {
            text: 'ID',
            dataIndex: 'id',
            hidden: true,
            align: 'right'
        },
        {
            text: 'Sum',
            columns: [
                {
                    text: 'Curr.',
                    dataIndex: 'currency_id',
                    width: 70,
                    align: 'center',
                    editor: {
                        xtype: 'combo',
                        valueField: 'id',
                        displayField: 'symbol',
                        itemId: 'currency',
                        queryMode: 'local',
                        typeAhead: true,
                        allowBlank: false,
                        forceSelection: true,
                        store: Financial.data.Currency.getStore()
                    },
                    filter: {
                        type: 'list',
                        store: Financial.data.Currency.getStore(),
                        idField: 'id',
                        labelField: 'iso_code'
                    },
                    renderer: function (value) {
                        return Financial.data.Currency.getById(value).get('symbol');
                    }
                },
                {
                    text: 'Value',
                    dataIndex: 'sum',
                    flex: 1,
                    align: 'right',
                    editor: {
                        xtype: 'numberfield',
                        itemId: 'sum',
                        allowBlank: false,
                        validator: function (value) {
                            if (parseFloat(value) === 0) {
                                return 'The value must be different than 0';
                            }

                            return true;
                        }
                    },
                    minWidth: 85,
                    renderer: function (value, metaData, record) {
                        Financial.util.Misc.anotherCurrenciesTooltip(
                            metaData,
                            Financial.data.Currency.getById(record.get('currency_id')),
                            record
                        );

                        return Financial.util.Format.money(value);
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
            },
            filter: {
                type: 'string'
            }
        },
        {
            text: 'Date',
            dataIndex: 'created_at',
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
            text: 'Blame',
            dataIndex: 'users',
            flex: 2,
            renderer: function (ids) {
                var ret = [];

                Financial.data.User.getStore().each(function (user) {
                    if (ids.indexOf(user.id) !== -1) {
                        ret.push(user.get('first_name'));
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
                forceSelection: true,
                store: Financial.data.User.getStore()
            }
            /*filter: {
                type: 'list',
                idField: 'id',
                labelField: 'full_name',
                store: Financial.data.User.getStore()
            }*/
        },
        {
            text: 'Categories',
            dataIndex: 'categories',
            flex: 2,
            renderer: function (ids) {
                var ret = [];

                Financial.data.Category.getStore().each(function (category) {
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
                queryMode: 'local',
                store: Financial.data.Category.getStore()
            }
            /*filter: {
                type: 'list',
                idField: 'id',
                labelField: 'name',
                store: Financial.data.Category.getStore()
            }*/
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
                }
            ],
            width: (16 + 4) * 1
        }
    ]
});