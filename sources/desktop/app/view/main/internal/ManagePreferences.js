Ext.define('Financial.view.main.internal.ManagePreferences', {
    extend: 'Financial.view.main.internal.ManagerWindow',

    width: '500px',
    height: '500px',

    title: 'Preferences',

    initComponent: function () {
        this.callParent(arguments);

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
                    }
                ]
            }
        ];

        this.add(items);
    },

    onDiscretenessChange: function (slider, value) {
        Financial.util.Discreteness.setValue(value);
    }
});