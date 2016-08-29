Ext.define('Financial.store.data.ReportStore', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.data.ReportModel',

    grouper: {
        property: 'group',
        sorterFn: function (model1, model2) {
            var getIndex = function (model) {
                return model.get('index') != null ? model.get('index') : model.get('group');
            };
            var index1 = getIndex(model1);
            var index2 = getIndex(model2);

            return index1 > index2 ? 1 : (index1 == index2 ? 0 : -1);
        }
    },

    proxy: {
        type: 'memory'
    }
});