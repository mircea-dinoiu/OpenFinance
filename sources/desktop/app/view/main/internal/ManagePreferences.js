Ext.define('Financial.view.main.internal.ManagePreferences', {
    extend: 'Financial.view.main.internal.ManagerWindow',

    width: '500px',
    height: '500px',

    title: 'Preferences',

    initComponent: function () {
        this.callParent(arguments);

        var displayCurrency = Financial.data.Currency.getDisplayCurrency();
        var currencyItems = [];

        Financial.data.Currency.getStore().each(function (each) {
            currencyItems.push({
                boxLabel: each.get('iso_code'),
                name: 'id',
                inputValue: each.get('id'),
                checked: each === displayCurrency,
            });
        });

        var items = [
            {
                xtype: 'form',
                padding: '20px 30px',
                items: [
                    {
                        xtype: 'slider',
                        width: 200,
                        value: Financial.util.Discreteness.getValue(),
                        increment: 10,
                        labelWidth: 80,
                        minValue: 0,
                        maxValue: 100,
                        fieldLabel: 'Discreteness',
                        tipText: function (thumb) {
                            return Ext.String.format('{0}%', thumb.value);
                        },
                        listeners: {
                            change: this.onDiscretenessChange
                        }
                    },
                    {
                        xtype: 'radiogroup',
                        fieldLabel: 'Display Currency',
                        // Arrange radio buttons into two columns, distributed vertically
                        columns: 2,
                        vertical: true,
                        items: currencyItems,
                        listeners: {
                            change: this.onDisplayCurrencyChange,
                        }
                    }
                ]
            }
        ];

        this.add(items);
    },

    onDiscretenessChange: function (slider, value) {
        Financial.util.Discreteness.setValue(value);
    },

    onDisplayCurrencyChange: function (group, value) {
        Financial.data.Currency.setDisplayCurrency(value.id);
        Financial.getApplication().getAppMain().setLoading(true);
        location.reload();
    }
});