Ext.define('Financial.view.main.internal.data.expenses.ExpensesGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'app-main-internal-data-expenses-grid',
    store: 'expense',
    controller: 'app-main-internal-data-expenses-grid',
    autoScroll: true,

    requires: [
        'Financial.view.main.internal.data.expenses.ExpensesGridController',
        'Financial.filter.grid.MultiListFilter'
    ],

    initComponent: function () {
        this.callParent(arguments);

        this.itemContextMenu = Ext.create('Ext.menu.Menu', {
            items: [
                {
                    text: 'Flag as finished',
                    iconCls: 'x-fa fa-lock',
                    handler: this.getController().onMarkExpensesSelectionAsFinishedClick.bind(this.getController())
                },
                {
                    text: 'Flag as pending',
                    iconCls: 'x-fa fa-unlock',
                    handler: this.getController().onMarkExpensesSelectionAsPendingClick.bind(this.getController())
                },
                {
                    xtype: 'menuseparator'
                },
                {
                    text: 'Round sum',
                    iconCls: 'x-fa fa-arrows-v',
                    handler: this.getController().onRoundExpenseSumClick.bind(this.getController())
                },
                {
                    text: 'Ceil sum',
                    iconCls: 'x-fa fa-long-arrow-up',
                    handler: this.getController().onCeilExpenseSumClick.bind(this.getController())
                },
                {
                    text: 'Floor sum',
                    iconCls: 'x-fa fa-long-arrow-down',
                    handler: this.getController().onFloorExpenseSumClick.bind(this.getController())
                }
            ]
        });
    },

    viewConfig: {
        getRowClass: function (record) {
            function day(date) {
                return Ext.util.Format.date(date, 'Y-m-d');
            }

            var classes = [];

            classes.push(record.get('status') + '-expense-row');
            classes.push('expense-row');

            if (record.get('created_at').getDate() % 2 === 0) {
                classes.push('even-row');
            } else {
                classes.push('odd-row');
            }

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
            },
            itemcontextmenu: function (view, record, item, index, e) {
                e.stopEvent(); // stops the default event. i.e. Windows Context Menu
                view.grid.itemContextMenu.showAt(e.getXY()); // show context menu where user right clicked
                return false;
            }
        },
        loadMask: false,
        stripeRows: false
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
            iconCls: 'x-fa fa-cart-plus',
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
            text: 'Duplicate',
            iconCls: 'x-fa fa-files-o',
            handler: 'onDuplicateClick',
            itemId: 'duplicate',
            disabled: true
        },
        {
            text: 'Delete',
            iconCls: 'x-fa fa-minus-circle',
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
                    resizable: false,
                    fit: true,
                    minWidth: 70,
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
                        store: 'currency'
                    },
                    filter: {
                        type: 'list',
                        store: 'currency',
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
                    resizable: false,
                    fit: true,
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
            minWidth: 100,
            editor: {
                xtype: 'combo',
                itemId: 'item',
                valueField: 'item',
                displayField: 'item',
                queryMode: 'local',
                allowBlank: false,
                listeners: {
                    blur: 'onItemInputBlur'
                }
            },
            filter: {
                type: 'string'
            },
            renderer: function (value, metaData) {
                metaData.tdAttr = 'data-qtip="' + value + '"';

                return value;
            }
        },
        {
            text: 'Date',
            dataIndex: 'created_at',
            formatter: 'date("D d-m-Y")',
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
            text: 'Categories',
            dataIndex: 'categories',
            flex: 2,
            renderer: function (ids, metaData) {
                var ret = [];

                Financial.data.Category.getStore().each(function (category) {
                    if (ids.indexOf(category.get('id')) !== -1) {
                        ret.push(category.get('name'));
                    }
                });

                metaData.tdAttr = 'data-qtip="' + ret.join('<br>') + '"';

                return ret.join(', ');
            },
            editor: {
                xtype: 'combo',
                itemId: 'categories',
                valueField: 'id',
                displayField: 'name',
                multiSelect: true,
                queryMode: 'local',
                store: 'category'
            },
            filter: {
                type: 'multilist',
                labelField: 'name',
                store: 'category'
            }
        },
        {
            dataIndex: 'money_location_id',
            text: 'Source',
            align: 'center',
            resizable: false,
            fit: true,
            renderer: Financial.util.Format.mlName,
            editor: {
                xtype: 'combo',
                valueField: 'id',
                displayField: 'name',
                itemId: 'money_location',
                queryMode: 'local',
                typeAhead: true,
                forceSelection: true,
                store: 'ml'
            },
            filter: {
                type: 'list',
                store: 'ml',
                labelField: 'name'
            }
        },
        {
            text: 'Blame',
            dataIndex: 'users',
            minWidth: 100,
            resizable: false,
            fit: true,
            align: 'center',
            renderer: Financial.util.Format.userIcons.bind(Financial.util.Format),
            editor: {
                xtype: 'combo',
                itemId: 'users',
                valueField: 'id',
                displayField: 'full_name',
                multiSelect: true,
                queryMode: 'local',
                forceSelection: true,
                store: 'user'
            },
            filter: {
                type: 'multilist',
                labelField: 'full_name',
                store: 'user'
            }
        }
    ]
});