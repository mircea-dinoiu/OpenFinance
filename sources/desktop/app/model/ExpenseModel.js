Ext.define('Financial.model.ExpenseModel', {
    extend: 'Financial.model.BaseRepeatModel',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'persist', type: 'boolean', defaultValue: true, persist: false},
        {name: 'sum', type: 'float', defaultValue: ''},
        {name: 'currency_id', type: 'int'},
        {name: 'item', type: 'string'},
        {name: 'repeat'},
        {
            name: 'created_at',
            type: 'date',
            convert: function (date) {
                return Ext.Date.parse(date, 'Y-m-d H:i:s') || date;
            }
        },
        {name: 'status', type: 'string', defaultValue: 'pending'},
        {
            name: 'users',
            convert: function (ids) {
                return (ids || []).map(function (id) {
                    return parseInt(id);
                });
            },
            sortType: function (ids) {
                var ret = [];

                Financial.data.User.getStore().each(function (user) {
                    if (ids.indexOf(user.id) !== -1) {
                        ret.push(user.get('first_name'));
                    }
                });

                return ret.join(', ');
            }
        },
        {
            name: 'categories',
            convert: function (ids) {
                return (ids || []).map(function (id) {
                    return parseInt(id);
                });
            },
            sortType: function (ids) {
                var ret = [];

                Financial.data.Category.getStore().each(function (category) {
                    if (ids.indexOf(category.get('id')) !== -1) {
                        ret.push(category.get('name'));
                    }
                });

                return ret.join(', ');
            }
        },
        {
            name: 'money_location_id',
            type: 'int',
            sortType: function (id) {
                return id == 0 ? '' : Financial.data.ML.getById(id).get('name');
            }
        }
    ]
});