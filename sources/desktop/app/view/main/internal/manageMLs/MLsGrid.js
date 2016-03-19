Ext.define('Financial.view.main.internal.manageMLs.MLsGrid', {
    extend: 'Financial.view.main.internal.managerWindow.ManagerWindowGrid',

    xtype: 'app-main-internal-manageMLs-grid',

    requires: 'Financial.view.main.internal.manageMLs.MLsGridController',

    controller: 'app-main-internal-manageMLs-grid',

    store: 'ml',

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
                        Financial.data.ML.getStore().each(function (record) {
                            if (id !== record.get('id') && cleanName(record.get('name')) === value) {
                                valid = false;
                            }

                            return valid;
                        });
                    }

                    return valid || 'The value must be unique';
                }
            }
        },
        {
            dataIndex: 'type_id',
            text: 'Type',
            align: 'center',
            resizable: false,
            fit: true,
            minWidth: 100,
            renderer: Financial.util.Format.mlTypeName.bind(Financial.util.Format),
            editor: {
                xtype: 'combo',
                valueField: 'id',
                displayField: 'name',
                itemId: 'mlType',
                queryMode: 'local',
                typeAhead: true,
                forceSelection: true,
                store: 'mlType'
            },
            filter: {
                type: 'list',
                store: 'mlType',
                labelField: 'name'
            }
        }
    ]
});