Ext.define('Financial.view.main.internal.manageCategories.CategoriesGrid', {
    extend: 'Ext.grid.Panel',

    xtype: 'app-main-internal-manageCategories-grid',

    requires: 'Financial.view.main.internal.manageCategories.CategoriesGridController',

    controller: 'app-main-internal-manageCategories-grid',

    border: false,
    store: Financial.util.Category.getStore(),
    autoScroll: true,
    bufferedRenderer: false,

    listeners: {
        beforedestroy: 'onBeforeDestroy',
        write: {
            element: 'store',
            fn: 'onStoreWrite'
        }
    },

    tbar: [
        {
            text: 'Add Category',
            iconCls: 'icon-folder_add',
            handler: 'addRecord'
        }
    ],

    plugins: [
        {
            ptype: 'rowediting',
            listeners: {
                beforeedit: 'onBeforeRowEditing',
                canceledit: 'onCancelRowEditing',
                edit: 'onRowEditing'
            }
        }
    ],

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
                        Financial.util.Category.getStore().each(function (record) {
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