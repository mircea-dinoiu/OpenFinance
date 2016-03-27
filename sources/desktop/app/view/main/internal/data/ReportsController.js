Ext.define('Financial.view.main.internal.data.ReportsController', {
    extend: 'Ext.app.ViewController',
    
    alias: 'controller.app-main-internal-data-reports',

    onIncludeChange: function () {
        Financial.app.getController('Data').syncReports();
    }
});