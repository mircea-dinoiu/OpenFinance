Ext.define('Financial.view.main.internal.data.incomes.IncomesGrid', {
    extend: 'Financial.base.FinancialGrid',
    store: 'income',
    xtype: 'app-main-internal-data-incomes-grid',
    controller: 'app-main-internal-data-incomes-grid',

    requires: [
        'Financial.view.main.internal.data.incomes.IncomesGridController'
    ],

    itemName: 'income',

    getDocked: function () {
        var items = this.callParent(arguments);

        items.forEach(function (docked) {
            _.findWhere(docked.items, {itemId: 'addRecordButton'}).iconCls = 'x-fa fa-plus-circle';
        });

        return items;
    },

    columns: [
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
            text: 'Date',
            formatter: 'date("D d-m-Y")',
            fit: true,
            tdCls: 'date',
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
            minWidth: 100,
            renderer: Financial.util.Format.userIcon.bind(Financial.util.Format),
            editor: {
                xtype: 'combo',
                selectOnTab: false,
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
                type: 'list',
                store: 'user',
                labelField: 'full_name'
            }
        },
        {
            dataIndex: 'money_location_id',
            text: 'Destination',
            align: 'center',
            resizable: false,
            fit: true,
            renderer: Financial.util.Format.mlName.bind(Financial.util.Format),
            editor: {
                xtype: 'combo',
                selectOnTab: false,
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
                type: 'list',
                store: 'ml',
                labelField: 'name'
            }
        },
        Financial.util.RepeatedModels.getRepeatColumnConfig()
    ]
});