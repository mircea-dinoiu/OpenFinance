Ext.define('Financial.view.main.internal.data.incomes.IncomesGrid', {
    extend: 'Financial.base.FinancialGrid',
    store: 'income',
    xtype: 'app-main-internal-data-incomes-grid',
    controller: 'app-main-internal-data-incomes-grid',

    requires: [
        'Financial.view.main.internal.data.incomes.IncomesGridController',
        'Financial.filter.grid.MultiListFilter'
    ],

    itemName: 'income',

    getDocked: function () {
        var items = this.callParent(arguments);

        items.forEach(function (docked) {
            _.findWhere(docked.items, {itemId: 'addRecordButton'}).iconCls = 'x-fa fa-plus-circle';
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
                dataIndex: 'sum',
                text: 'Sum',
                resizable: false,
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
                minWidth: 100,
                editor: {
                    xtype: 'textfield',
                    allowOnlyWhitespace: false
                },
                filter: {
                    type: 'string'
                },
                renderer: function () {
                    return this.renderFlagColumn.apply(this, arguments);
                }
            },
            {
                dataIndex: 'created_at',
                text: 'Date & Time',
                formatter: 'date(" D d-m-Y, H:i ")',
                tdCls: 'date',
                resizable: false,
                align: 'center',
                editor: {
                    xtype: 'datefield',
                    format: 'd-m-Y, H:i',
                    startDay: 1
                }
            },
            {
                dataIndex: 'user_id',
                text: 'From',
                align: 'center',
                resizable: false,
                minWidth: 100,
                renderer: Financial.util.Format.userIcon.bind(Financial.util.Format),
                editor: {
                    xtype: 'combo',
                    valueField: 'id',
                    displayField: 'full_name',
                    itemId: 'user',
                    queryMode: 'local',
                    anyMatch: true,
                    typeAhead: true,
                    allowBlank: false,
                    forceSelection: true,
                    store: 'user'
                },
                filter: {
                    type: 'multilist',
                    store: 'user',
                    labelField: 'full_name'
                }
            },
            {
                dataIndex: 'money_location_id',
                text: 'Destination',
                align: 'center',
                resizable: false,
                renderer: Financial.util.Format.mlName.bind(Financial.util.Format),
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
            Financial.util.RepeatedModels.getRepeatColumnConfig()
        ]
    }
});