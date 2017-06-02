Ext.define('Financial.view.main.internal.data.expenses.ExpensesGrid', {
    extend: 'Financial.base.FinancialGrid',
    xtype: 'app-main-internal-data-expenses-grid',
    store: 'expense',
    controller: 'app-main-internal-data-expenses-grid',

    requires: [
        'Financial.view.main.internal.data.expenses.ExpensesGridController',
        'Financial.filter.grid.MultiListFilter'
    ],

    itemName: 'expense',

    getDocked: function () {
        var items = this.callParent(arguments);

        items.forEach(function (docked) {
            _.find(docked.items, {itemId: 'addRecordButton'}).iconCls = 'x-fa fa-cart-plus';
        });

        return items;
    },

    columns: {
        defaults: {
            fit: true
        },
        items: [
            {
                text: 'ID',
                dataIndex: 'id',
                hidden: true,
                align: 'right',
                renderer: Financial.util.RepeatedModels.idColumnRenderer
            },
            {
                text: 'Sum',
                columns: [
                    {
                        text: 'Curr.',
                        dataIndex: 'currency_id',
                        resizable: false,
                        minWidth: 70,
                        align: 'center',
                        editor: {
                            xtype: 'combo',
                            valueField: 'id',
                            displayField: 'symbol',
                            itemId: 'currency',
                            queryMode: 'local',
                            typeAhead: true,
                            anyMatch: true,
                            allowBlank: false,
                            forceSelection: true,
                            store: 'currency'
                        },
                        filter: {
                            type: 'multilist',
                            store: 'currency',
                            idField: 'id',
                            labelField: 'iso_code'
                        },
                        renderer: function (id) {
                            return Financial.util.Format.currencyColumn(id);
                        }
                    },
                    {
                        text: 'Value',
                        dataIndex: 'sum',
                        resizable: false,
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
                            var Currency = Financial.data.Currency;

                            Financial.util.Misc.anotherCurrenciesTooltip(
                                metaData,
                                record.get('currency_id') == Currency.getDefaultCurrency().get('id') ? Currency.getDisplayCurrency() : Currency.getById(record.get('currency_id')),
                                record
                            );

                            return Financial.util.Format.money(
                                record.get('currency_id') == Currency.getDefaultCurrency().get('id') ? Currency.convertDefaultToDisplay(value) : value,
                            );
                        }
                    }
                ]
            },
            {
                text: 'Description',
                dataIndex: 'item',
                minWidth: 100,
                editor: {
                    xtype: 'combo',
                    selectOnTab: false,
                    itemId: 'item',
                    valueField: 'item',
                    displayField: 'item',
                    queryMode: 'remote',
                    queryParam: 'search',
                    anyMatch: true,
                    allowBlank: false,
                    listeners: {
                        blur: 'onItemInputBlur'
                    },
                    listConfig: {
                        getInnerTpl: function () {
                            return '{item}<span class="item-usages">{usages:plural("item")}</span>';
                        }
                    }
                },
                filter: {
                    type: 'string'
                },
                renderer: function () {
                    return this.renderFlagColumn.apply(this, arguments);
                }
            },
            {
                text: 'Date & Time',
                dataIndex: 'created_at',
                tdCls: 'date',
                formatter: 'date(" D d-m-Y, H:i ")',
                resizable: false,
                align: 'center',
                editor: {
                    xtype: 'datefield',
                    format: 'd-m-Y, H:i',
                    startDay: 1
                }
            },
            {
                text: 'Categories',
                dataIndex: 'categories',
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
                    anyMatch: true,
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
                text: 'Payment method',
                align: 'center',
                resizable: false,
                renderer: Financial.util.Format.mlName,
                editor: {
                    xtype: 'combo',
                    valueField: 'id',
                    displayField: 'name',
                    itemId: 'money_location',
                    queryMode: 'local',
                    anyMatch: true,
                    typeAhead: true,
                    forceSelection: true,
                    store: 'ml'
                },
                filter: {
                    type: 'multilist',
                    store: 'ml',
                    labelField: 'name'
                }
            },
            {
                text: 'Charged person(s)',
                dataIndex: 'users',
                minWidth: 100,
                resizable: false,
                align: 'center',
                renderer: Financial.util.Format.userIcons.bind(Financial.util.Format),
                editor: {
                    xtype: 'combo',
                    itemId: 'users',
                    valueField: 'id',
                    displayField: 'full_name',
                    multiSelect: true,
                    queryMode: 'local',
                    anyMatch: true,
                    forceSelection: true,
                    store: 'user'
                },
                filter: {
                    type: 'multilist',
                    labelField: 'full_name',
                    store: 'user'
                }
            },
            Financial.util.RepeatedModels.getRepeatColumnConfig()
        ]
    }
});