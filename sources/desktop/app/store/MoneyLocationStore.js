Ext.define('Financial.store.MoneyLocationStore', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.MoneyLocationModel',
    autoDestroy: false,
    storeId: 'moneyLocation',

    sorters: [
        {
            property: 'name',
            direction: 'ASC'
        }
    ],

    proxy: {
        type: 'ajax',
        reader: {
            type: 'json'
        },
        api: {
            read: Financial.routes.moneyLocation.list,
            create: Financial.routes.moneyLocation.create,
            update: Financial.routes.moneyLocation.update
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            rootProperty: 'data',
            allowSingle: false
        }
    }
});