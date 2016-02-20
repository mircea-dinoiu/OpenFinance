Ext.define('Financial.model.ExpenseModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'sum', type: 'float', defaultValue: ''},
        {name: 'currency_id', type: 'int'},
        {name: 'item', type: 'string'},
        {
            name: 'created_at',
            type: 'date',
            convert: function (date) {
                return Ext.Date.parse(date, 'Y-m-d H:i:s') || date;
            }
        },
        {name: 'status', type: 'string'},
        {
            name: 'users',
            convert: function (users) {
                var ids = [];

                Ext.each(users, function (user) {
                    ids.push(parseInt(user.hasOwnProperty('id') ? user.id : user));
                });

                return ids;
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
            convert: function (categories) {
                var ids = [];

                Ext.each(categories, function (category) {
                    ids.push(parseInt(category.hasOwnProperty('id') ? category.id : category));
                });

                return ids;
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
                return id == 0 ? '' : Financial.data.MoneyLocation.getById(id).get('name');
            }
        }
    ]
});