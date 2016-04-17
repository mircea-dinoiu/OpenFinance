Ext.define('Financial.store.BaseRepeatStore', {
    extend: 'Ext.data.Store',

    listeners: {
        write: function (store, operation) {
            if (Financial.util.RepeatedModels.shouldRefreshAllData(operation)) {
                Financial.app.getController('Data').loadData();
            } else {
                Financial.app.getController('Data').syncReports();
            }
        },
        filterchange: function () {
            Financial.app.getController('Data').syncReports();
        }
    }
});