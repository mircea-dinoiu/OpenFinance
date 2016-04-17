Ext.define('Financial.store.BaseRepeatStore', {
    extend: 'Ext.data.Store',

    listeners: {
        write: function (store) {
            Financial.util.RepeatedModels.generateClones(store);
            Financial.app.getController('Data').syncReports();
        },
        filterchange: function () {
            Financial.app.getController('Data').syncReports();
        }
    },

    onlyPersistent: function (records) {
        return records.filter(function (record) {
            return record.get('persist');
        });
    },

    getRemovedRecords: function () {
        return this.onlyPersistent(this.callParent(arguments));
    },

    getNewRecords: function () {
        return this.onlyPersistent(this.callParent(arguments));
    }
});