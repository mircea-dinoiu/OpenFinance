Ext.define('Financial.store.data.ReportStore', function () {
    var displayFilter = function (record) {
        return record.get('display') === true;
    };

    return {
        extend: 'Ext.data.Store',

        model: 'Financial.model.data.ReportModel',

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