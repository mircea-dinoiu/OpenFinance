Ext.define('Financial.store.BaseRepeatStore', {
    extend: 'Ext.data.Store',

    autoLoad: false,

    listeners: {
        write: function () {
            Financial.app.getController('Data').syncReports();
        }
    }
});