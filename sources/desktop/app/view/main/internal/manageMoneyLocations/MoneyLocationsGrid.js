Ext.define('Financial.view.main.internal.manageMoneyLocations.MoneyLocationsGrid', {
    extend: 'Financial.view.main.internal.managerWindow.ManagerWindowGrid',

    xtype: 'app-main-internal-manageMoneyLocations-grid',

    requires: 'Financial.view.main.internal.manageMoneyLocations.MoneyLocationsGridController',

    controller: 'app-main-internal-manageMoneyLocations-grid',

    store: 'moneyLocation',

    columns: [
        {
            header: 'Name',
            dataIndex: 'name',
            flex: 1,
            editor: {
                xtype: 'textfield',
                allowOnlyWhitespace: false,
                validator: function (value) {
                    var valid = true,
                        id = this.up().getRecord().get('id');

                    function cleanName(name) {
                        return name.trim().toLowerCase();
                    }

                    value = cleanName(value);

                    if (value.length) {
                        Financial.data.MoneyLocation.getStore().each(function (record) {
                            if (id !== record.get('id') && cleanName(record.get('name')) === value) {
                                valid = false;
                            }

                            return valid;
                        });
                    }

                    return valid || 'The value must be unique';
                }
            }
        }
    ]
});