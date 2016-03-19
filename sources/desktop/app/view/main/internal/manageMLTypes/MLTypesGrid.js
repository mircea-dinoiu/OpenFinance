Ext.define('Financial.view.main.internal.manageMLTypes.MLTypesGrid', {
    extend: 'Financial.view.main.internal.managerWindow.ManagerWindowGrid',

    xtype: 'app-main-internal-manageMLTypes-grid',

    requires: 'Financial.view.main.internal.manageMLTypes.MLTypesGridController',

    controller: 'app-main-internal-manageMLTypes-grid',

    store: 'mlType',

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
                        Financial.data.MLType.getStore().each(function (record) {
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