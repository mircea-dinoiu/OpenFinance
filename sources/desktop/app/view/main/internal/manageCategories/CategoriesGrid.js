Ext.define('Financial.view.main.internal.manageCategories.CategoriesGrid', {
    extend: 'Financial.view.main.internal.managerWindow.ManagerWindowGrid',

    xtype: 'app-main-internal-manageCategories-grid',

    requires: 'Financial.view.main.internal.manageCategories.CategoriesGridController',

    controller: 'app-main-internal-manageCategories-grid',

    store: 'category',

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
                        Financial.data.Category.getStore().each(function (record) {
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
            xtype: 'actioncolumn',
            editor: {
                xtype: 'label',
                text: ''
            },
            items: [
                {
                    iconCls: 'x-fa fa-minus-circle',
                    tooltip: 'Delete',
                    handler: 'onDeleteClick'
                }
            ],
            resizable: false,
            fit: true
        }
    ]
});