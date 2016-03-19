Ext.define('Financial.model.MLModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'type_id', type: 'int', sortType: function (id) {
            return id == 0 ? '' : Financial.data.MLType.getById(id).get('name');
        }}
    ]
});