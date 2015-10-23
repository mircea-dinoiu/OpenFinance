Ext.define('Financial.store.data.Report', function () {
    var displayFilter = function (record) {
        return record.get('display') === true;
    };

    return {
        extend: 'Ext.data.Store',

        model: 'Financial.model.data.Report',

        groupField: 'type',

        proxy: {
            type: 'memory'
        },

        refreshDisplayed: function () {
            this.filter(displayFilter);
        },

        filters: [
            displayFilter
        ]
    };
}());