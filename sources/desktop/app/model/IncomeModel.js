Ext.define('Financial.model.IncomeModel', {
    extend: 'Financial.model.BaseRepeatModel',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'persist', type: 'boolean', defaultValue: true, persist: false},
        {name: 'sum', type: 'float', defaultValue: ''},
        {name: 'description', type: 'string'},
        {name: 'repeat'},
        {name: 'status', type: 'string', defaultValue: 'pending'},
        {
            name: 'created_at',
            type: 'date',
            convert: function (date) {
                return Ext.Date.parse(date, 'Y-m-d H:i:s') || date;
            }
        },
        {
            name: 'user_id',
            type: 'int',
            sortType: function (userId) {
                return Financial.data.User.getById(userId).get('full_name');
            }
        },
        {
            name: 'money_location_id',
            type: 'int',
            sortType: function (id) {
                return id == 0 ? '' : Financial.data.ML.getById(id).get('name');
            }
        }
    ],

    proxy: {
        type: 'ajax',
        reader: {
            type: 'json'
        },
        limitParam: undefined, // TODO REMOVE SOON
        api: {
            read: Financial.routes.income.list,
            create: Financial.routes.income.create,
            update: Financial.routes.income.update,
            destroy: Financial.routes.income.destroy
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            rootProperty: 'data',
            allowSingle: false
        }
    }
});