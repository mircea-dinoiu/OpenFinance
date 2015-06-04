Ext.define('Financial.model.Expense', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'sum', type: 'float'},
        {name: 'currency_id', type: 'int'},
        {name: 'item', type: 'string'},
        {name: 'created_at', type: 'date'},
        {name: 'status', type: 'string'},
        {
            name: 'users',
            convert: function (users) {
                var ids = [];

                Ext.each(users, function (user) {
                    ids.push(parseInt(user.hasOwnProperty('id') ? user.id : user));
                });

                return ids;
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
            }
        }
    ]
});