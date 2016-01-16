Ext.define('Financial.store.IncomeStore', {
    extend: 'Ext.data.Store',

    requires: 'Financial.model.IncomeModel',

    config: {
        storeId: 'income',

        model: 'Financial.model.IncomeModel',

        autoLoad: false,
        autoDestroy: true,

        sorters: [
            {
                property: 'created_at',
                direction: 'DESC'
            },
            {
                property: 'id',
                direction: 'DESC'
            }
        ],

        proxy: {
            type: 'ajax',
            reader: {
                type: 'json'
            },
            extraParams: {
                start_date: (function () {
                    var date = new Date;

                    date.setDate(1);

                    return Ext.util.Format.date(date, 'Y-m-d')
                }()),
                end_date: (function () {
                    var date = new Date;

                    date.setMonth(date.getMonth() + 1);
                    date.setDate(0);

                    return Ext.util.Format.date(date, 'Y-m-d');
                }())
            },
            api: {
                read: Financial.routes.income.list,
                create: Financial.routes.income.create,
                update: Financial.routes.income.update,
                destroy: Financial.routes.income.destroy
            },
            writer: {
                type: 'json',
                writeAllFields: false,
                rootProperty: 'data'
            }
        }
    }
});