Ext.define('Financial.store.Expense', {
    extend: 'Ext.data.Store',

    requires: 'Financial.model.Expense',

    config: {
        storeId: 'expense',

        model: 'Financial.model.Expense',

        autoLoad: false,

        autoDestroy: false,

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

        grouper: {
            groupFn: function (record) {
                return Ext.util.Format.date(record.get('created_at'), 'd-m-Y D');
            }
        },

        groupDir: 'DESC',

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
                read: Financial.routes.expense.list,
                create: Financial.routes.expense.create,
                update: Financial.routes.expense.update,
                destroy: Financial.routes.expense.destroy
            },
            writer: {
                type: 'json',
                writeAllFields: false,
                rootProperty: 'data'
            }
        }
    }
});